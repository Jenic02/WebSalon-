import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  service: { type: String, required: true },
  stylist: { type: String, required: true },
  stylistKey: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: '' },
  price: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ date: 1, time: 1, stylistKey: 1 });

export default mongoose.model('Booking', bookingSchema);
