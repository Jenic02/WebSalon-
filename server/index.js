import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import Booking from './models/Booking.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const STYLIST_KEYS = ['member1Name', 'member2Name', 'member3Name', 'member4Name'];

const stylistLabelMap = {
  member1Name: { en: 'Marija Nikolic', sr: 'Marija Nikoli\u0107' },
  member2Name: { en: 'Jelena Kostic', sr: 'Jelena Kosti\u0107' },
  member3Name: { en: 'Ana Petrovic', sr: 'Ana Petrovi\u0107' },
  member4Name: { en: 'Nikola Jovanovic', sr: 'Nikola Jovanovi\u0107' },
};

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salon';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

function makeToken() {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(ADMIN_PASSWORD).digest('hex');
}

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice(7);
  if (token !== makeToken()) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}

async function findFreeStylist(date, time) {
  const busyAtTime = await Booking.find({ date, time }).select('stylistKey');
  const busyKeys = busyAtTime.map((b) => b.stylistKey);
  const free = STYLIST_KEYS.filter((k) => !busyKeys.includes(k));

  if (free.length === 0) return null;

  const todayBookings = await Booking.find({ date });
  const counts = {};
  for (const k of STYLIST_KEYS) {
    counts[k] = todayBookings.filter((b) => b.stylistKey === k).length;
  }
  free.sort((a, b) => counts[a] - counts[b]);
  return free[0];
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const distDir = join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'salon@example.com';

function formatDateTime(dateStr, timeStr) {
  const d = dateStr ? dateStr.split('-').reverse().join('.') : '';
  return `${d} u ${timeStr || ''}`;
}

// ===== PUBLIC API =====

app.get('/api/booked-slots', async (req, res) => {
  try {
    const bookings = await Booking.find({}, { date: 1, time: 1, stylistKey: 1, stylist: 1, _id: 0 });
    res.json({ slots: bookings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    const { name, phone, email, service, stylist, stylistKey, date, time, notes, lang, price } = req.body;
    console.log('Booking request:', { name, phone, service, stylistKey, date, time });

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let assignedKey = stylistKey;

    if (!assignedKey) {
      assignedKey = await findFreeStylist(date, time);
      if (!assignedKey) {
        return res.status(409).json({
          errorCode: 'ALL_STYLISTS_BUSY',
          error: 'Svi stilisti su zauzeti u ovom terminu.',
        });
      }
    } else {
      const conflict = await Booking.findOne({ date, time, stylistKey: assignedKey });
      if (conflict) {
        return res.status(409).json({
          errorCode: 'SLOT_TAKEN',
          error: 'This time slot is already booked.',
        });
      }
    }

    const language = lang || 'sr';
    const assignedStylistName = stylistLabelMap[assignedKey]?.[language] || assignedKey;

    const newBooking = new Booking({
      name,
      phone,
      email: email || '',
      service,
      stylist: assignedStylistName,
      stylistKey: assignedKey,
      date,
      time,
      notes: notes || '',
      price: price || '',
    });

    await newBooking.save();

    const mailOptions = {
      from: `"Salon Booking" <${process.env.SMTP_USER}>`,
      to: OWNER_EMAIL,
      subject: `Nova rezervacija - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #C9A96E;">Nova rezervacija</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Ime:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email || '-'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Usluga:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${service}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Stilista:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${assignedStylistName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Datum:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDateTime(date, '')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Vreme:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Napomena:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${notes || '-'}</td></tr>
          </table>
        </div>
      `,
    };

    try { await transporter.sendMail(mailOptions); } catch {}

    res.json({
      success: true,
      message: 'Booking confirmed',
      assignedStylist: assignedStylistName,
      assignedStylistKey: assignedKey,
    });
  } catch (err) {
    console.error('=== BOOKING ERROR ===');
    console.error('Message:', err.message);
    console.error('Name:', err.name);
    if (err.errors) console.error('Validation errors:', JSON.stringify(err.errors));
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Failed to send booking', detail: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const mailOptions = {
      from: `"Salon Contact" <${process.env.SMTP_USER}>`,
      to: OWNER_EMAIL,
      subject: `Nova poruka sa sajta - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #C9A96E;">Nova poruka sa kontakt forme</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Ime:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Poruka:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td></tr>
          </table>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ===== ADMIN API =====

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: makeToken() });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/bookings/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split('T')[0];

    const total = await Booking.countDocuments();
    const todayCount = await Booking.countDocuments({ date: dateStr });
    const perStylist = [];
    for (const k of STYLIST_KEYS) {
      perStylist.push({
        key: k,
        name: stylistLabelMap[k]?.sr || k,
        count: await Booking.countDocuments({ stylistKey: k }),
      });
    }
    res.json({ total, today: todayCount, perStylist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/bookings', adminAuth, async (req, res) => {
  try {
    const { stylist, search, dateFrom, dateTo, page = 1, limit = 100 } = req.query;
    const filter = {};

    if (stylist) filter.stylistKey = stylist;
    if (search) {
      const s = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { service: { $regex: s, $options: 'i' } },
      ];
    }
    if (dateFrom) filter.date = { $gte: dateFrom };
    if (dateTo) filter.date = { ...filter.date, $lte: dateTo };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ date: -1, time: -1 }).skip(skip).limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error('Admin bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== SPA FALLBACK =====

app.get('*', async (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  try {
    const html = await readFile(join(distDir, 'index.html'), 'utf-8');
    res.send(html);
  } catch {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
