import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'], default: 'New' },
  score: { type: Number, default: 0 },
  notes: { type: String },
  lastContactDate: { type: Date },
});

export default mongoose.model('Lead', leadSchema);