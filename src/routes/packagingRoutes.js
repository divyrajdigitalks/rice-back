const express = require('express');
const router = express.Router();
const packagingController = require('../controllers/packagingController');

// GET all packaging data
router.get('/', packagingController.getAllPackaging);

// POST new packaging data
router.post('/', packagingController.createPackaging);

// PUT update existing packaging data
router.put('/:id', packagingController.updatePackaging);

// DELETE packaging data
router.delete('/:id', packagingController.deletePackaging);

// POST bulk insert/update
router.post('/bulk', packagingController.bulkUpsertPackaging);

module.exports = router;
