const express = require('express');
const {
  getSettings,
  updateSettings,
} = require('../controllers/settingController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getSettings).put(updateSettings);

module.exports = router;
