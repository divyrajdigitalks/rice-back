const express = require('express');
const {
  getExmills,
  getExmill,
  createExmill,
  updateExmill,
  deleteExmill,
} = require('../controllers/exmillController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getExmills).post(createExmill);
router.route('/:id').get(getExmill).put(updateExmill).delete(deleteExmill);

module.exports = router;
