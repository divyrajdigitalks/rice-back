const express = require('express');
const leadRoutes = require('./leadRoutes');
const exmillRoutes = require('./exmillRoutes');
const freightRoutes = require('./freightRoutes');
const authRoutes = require('./authRoutes');
const settingRoutes = require('./settingRoutes');

const router = express.Router();

const packagingRoutes = require('./packagingRoutes');


router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/exmill', exmillRoutes);
router.use('/freight', freightRoutes);
router.use('/settings', settingRoutes);
router.use('/packaging', packagingRoutes);

module.exports = router;
    