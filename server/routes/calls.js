import express from 'express';
import twilio from 'twilio';
import OpenAI from 'openai';
import { ElevenLabs } from '@eleven-labs/elevenlabs-node';
import Call from '../models/Call.js';
import Lead from '../models/Lead.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const elevenlabs = new ElevenLabs(process.env.ELEVENLABS_API_KEY);

router.use(auth);

router.post('/initiate', async (req, res) => {
  try {
    const { leadId } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).send({ error: 'Lead not found' });
    }

    const call = await client.calls.create({
      url: 'http://your-ngrok-url/api/calls/handle',
      to: lead.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    const newCall = new Call({
      lead: lead._id,
      agent: req.user._id,
      date: new Date(),
    });
    await newCall.save();

    res.send({ message: 'Call initiated', callSid: call.sid });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/handle', async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  // This is a simplified example. In a real-world scenario, you'd implement
  // more complex logic for handling the conversation flow.
  const aiResponse = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "You are an AI sales agent. Introduce yourself and ask if the person has time to talk about our product.",
    max_tokens: 150
  });

  const speechResponse = await elevenlabs.textToSpeech(aiResponse.data.choices[0].text);

  twiml.play(speechResponse);

  res.type('text/xml');
  res.send(twiml.toString());
});

router.get('/analytics', async (req, res) => {
  try {
    const totalCalls = await Call.countDocuments();
    const scheduledMeetings = await Call.countDocuments({ outcome: 'Scheduled Meeting' });
    const conversionRate = (scheduledMeetings / totalCalls) * 100;

    res.send({
      totalCalls,
      scheduledMeetings,
      conversionRate: conversionRate.toFixed(2) + '%'
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;