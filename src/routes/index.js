const express = require('express');
const leadRoutes = require('./leadRoutes');
const exmillRoutes = require('./exmillRoutes');
const freightRoutes = require('./freightRoutes');
const authRoutes = require('./authRoutes');
const settingRoutes = require('./settingRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/exmill', exmillRoutes);
router.use('/freight', freightRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
