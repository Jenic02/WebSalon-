import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const BOOKINGS_FILE = join(__dirname, 'bookings.json');

function readBookings() {
  if (!existsSync(BOOKINGS_FILE)) return [];
  return JSON.parse(readFileSync(BOOKINGS_FILE, 'utf-8'));
}

function saveBooking(entry) {
  const bookings = readBookings();
  bookings.push(entry);
  writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
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
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'salon@example.com';

function formatDateTime(dateStr, timeStr) {
  const d = dateStr ? dateStr.split('-').reverse().join('.') : '';
  return `${d} u ${timeStr || ''}`;
}

app.get('/api/booked-slots', (req, res) => {
  const bookings = readBookings();
  const slots = bookings.map((b) => ({
    date: b.date,
    time: b.time,
    stylist: b.stylist,
  }));
  res.json({ slots });
});

app.post('/api/booking', async (req, res) => {
  try {
    const { name, phone, email, service, stylist, date, time, notes } = req.body;

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookings = readBookings();
    const conflict = bookings.some(
      (b) => b.date === date && b.time === time && b.stylist === stylist
    );
    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    saveBooking({ name, phone, email, service, stylist, date, time, notes, createdAt: new Date().toISOString() });

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
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Stilista:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${stylist || 'Bilo ko'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Datum:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDateTime(date, '')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Vreme:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Napomena:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${notes || '-'}</td></tr>
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Booking confirmed' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to send booking' });
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
