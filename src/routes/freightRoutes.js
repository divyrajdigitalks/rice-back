const express = require('express');
const {
  getFreights,
  getFreight,
  createFreight,
  updateFreight,
  deleteFreight,
} = require('../controllers/freightController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getFreights).post(createFreight);
router.route('/:id').get(getFreight).put(updateFreight).delete(deleteFreight);

module.exports = router;
