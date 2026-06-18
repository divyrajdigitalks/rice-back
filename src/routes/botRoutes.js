const express = require('express');
const { getSizeGroups, getDynamicSizes, getPackagingTypeGroups, getDynamicPackagingTypes, getVarietyGroups, getDynamicVarieties, getFormGroups, getDynamicForms, getDynamicRegions, getCountryGroups, getDynamicCountries, calculateQuote, createLeadBot } = require('../controllers/botController');

const router = express.Router();

// @route   GET /api/bot/menus/size-groups
// @desc    Get the top-level size groups
// @access  Public
router.get('/menus/size-groups', getSizeGroups);

// @route   GET /api/bot/menus/sizes
// @desc    Get dynamic sizes grouped
// @access  Public
router.get('/menus/sizes', getDynamicSizes);

// @route   GET /api/bot/menus/packaging-type-groups
// @desc    Get packaging type groups
// @access  Public
router.get('/menus/packaging-type-groups', getPackagingTypeGroups);

// @route   GET /api/bot/menus/packaging-types
// @desc    Get dynamic packaging types grouped (optionally filtered by ?size=)
// @access  Public
router.get('/menus/packaging-types', getDynamicPackagingTypes);

// @route   GET /api/bot/menus/variety-groups
// @desc    Get rice variety groups
// @access  Public
router.get('/menus/variety-groups', getVarietyGroups);

// @route   GET /api/bot/menus/varieties
// @desc    Get dynamic rice varieties grouped by Basmati/Non-Basmati
// @access  Public
router.get('/menus/varieties', getDynamicVarieties);

// @route   GET /api/bot/menus/form-groups
// @desc    Get processing form groups
// @access  Public
router.get('/menus/form-groups', getFormGroups);

// @route   GET /api/bot/menus/forms
// @desc    Get dynamic processing forms (optionally filtered by ?variety=)
// @access  Public
router.get('/menus/forms', getDynamicForms);


// @route   GET /api/bot/menus/regions
// @desc    Get dynamic regions
// @access  Public
router.get('/menus/regions', getDynamicRegions);

// @route   GET /api/bot/menus/country-groups
// @desc    Get country sub-regions (optionally filtered by ?region=)
// @access  Public
router.get('/menus/country-groups', getCountryGroups);

// @route   GET /api/bot/menus/countries
// @desc    Get dynamic countries (optionally filtered by ?region=)
// @access  Public
router.get('/menus/countries', getDynamicCountries);


// @route   POST /api/bot/quote
// @desc    Calculate quote (EX MILL, FOB, CIF)
// @access  Public
router.post('/quote', calculateQuote);


// @route   POST /api/bot/lead
// @desc    Create lead from bot
// @access  Public
router.post('/lead', createLeadBot);

module.exports = router;
