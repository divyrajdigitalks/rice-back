const express = require('express');
const {
  getSettingByKey,
  updateSetting,
} = require('../controllers/settingController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/:key').get(getSettingByKey).put(updateSetting);

module.exports = router;
