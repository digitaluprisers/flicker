import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number },
  outcome: { type: String, enum: ['Scheduled Meeting', 'Follow Up', 'Not Interested', 'No Answer'] },
  notes: { type: String },
  transcript: { type: String },
});

export default mongoose.model('Call', callSchema);