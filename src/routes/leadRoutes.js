const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  createLeadBot,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route for WhatsApp Bot
router.post('/bot', createLeadBot);

router.use(protect);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

module.exports = router;
