const express = require('express');
const leadRoutes = require('./leadRoutes');
const exmillRoutes = require('./exmillRoutes');
const freightRoutes = require('./freightRoutes');
const authRoutes = require('./authRoutes');
const settingRoutes = require('./settingRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

const packagingRoutes = require('./packagingRoutes');
const botRoutes = require('./botRoutes');

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/exmill', exmillRoutes);
router.use('/freight', freightRoutes);
router.use('/settings', settingRoutes);
router.use('/packaging', packagingRoutes);
router.use('/bot', botRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
