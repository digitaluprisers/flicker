import express from 'express';
import Lead from '../models/Lead.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).send(lead);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find({});
    res.send(leads);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) {
      return res.status(404).send();
    }
    res.send(lead);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;