const Lead = require('../models/Lead');
const Exmill = require('../models/Exmill');
const Packaging = require('../models/Packaging');
const Setting = require('../models/Setting');
const Freight = require('../models/Freight');
const mongoose = require('mongoose');

// Helper function to generate sequential IDs (1, 2, 3...)
const mapWithSequentialId = (items, startId = 1) => {
  return items.map((item, index) => ({ id: String(startId + index), name: item }));
};

// Helper for parsing grams from size string for sorting/grouping
const parseSizeInGrams = (sizeStr) => {
  const s = sizeStr.toLowerCase();
  if (s.includes('g') && !s.includes('kg')) return parseInt(s, 10);
  if (s.includes('kg')) return parseFloat(s) * 1000;
  if (s.includes('lbs')) return parseFloat(s) * 453.592;
  return 0;
};

// @desc    Get just the size groups
// @route   GET /api/bot/menus/size-groups
// @access  Public
const getSizeGroups = async (req, res, next) => {
  try {
    const groups = [
      { id: "1", name: "RETAIL / SMALL PACK" },
      { id: "2", name: "BULK / EXPORT PACK" }
    ];
    res.status(200).json({
      success: true,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic sizes grouped by Retail vs Bulk
// @route   GET /api/bot/menus/sizes
// @access  Public
const getDynamicSizes = async (req, res, next) => {
  try {
    const distinctSizes = await Packaging.distinct('packSize');
    distinctSizes.sort((a, b) => parseSizeInGrams(a) - parseSizeInGrams(b));

    const retailSizes = [];
    const bulkSizes = [];
    let idCounter = 1;

    distinctSizes.forEach(size => {
      const grams = parseSizeInGrams(size);
      const isLbs = size.toLowerCase().includes('lbs');
      if (isLbs || grams > 25000) {
        bulkSizes.push({ id: String(idCounter++), name: size });
      } else {
        retailSizes.push({ id: String(idCounter++), name: size });
      }
    });

    const groups = {
      "RETAIL / SMALL PACK": retailSizes,
      "BULK / EXPORT PACK": bulkSizes
    };

    let responseData = groups;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(groups).find(k => k.toUpperCase().includes(q));
      if (key) responseData = groups[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get just the packaging type groups
// @route   GET /api/bot/menus/packaging-type-groups
// @access  Public
const getPackagingTypeGroups = async (req, res, next) => {
  try {
    const groups = [
      { id: "1", name: "JUTE BAGS" },
      { id: "2", name: "PP / BOPP BAGS" },
      { id: "3", name: "2D POUCHES" },
      { id: "4", name: "3D POUCHES" },
      { id: "5", name: "CENTRE SEAL POUCHES" }
    ];
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};
// @desc    Get dynamic packaging types based on size, grouped
// @route   GET /api/bot/menus/packaging-types
// @access  Public
const getDynamicPackagingTypes = async (req, res, next) => {
  try {
    const { size } = req.query;

    let targetGrams = null;
    if (size) {
      targetGrams = parseSizeInGrams(size);
    }

    const allPackaging = await Packaging.find().select('productName packSize');
    const matchedNames = new Set();

    allPackaging.forEach(doc => {
      if (targetGrams) {
        if (parseSizeInGrams(doc.packSize) === targetGrams) {
          matchedNames.add(doc.productName);
        }
      } else {
        matchedNames.add(doc.productName);
      }
    });

    const groups = {
      "JUTE BAGS": [],
      "PP / BOPP BAGS": [],
      "2D POUCHES": [],
      "3D POUCHES": [],
      "CENTRE SEAL POUCHES": []
    };

    let idCounter = 1;
    matchedNames.forEach(name => {
      const lowerName = name.toLowerCase();
      let displayName = name;
      if (displayName.length > 20) {
        displayName = displayName.substring(0, 20) + '..';
      }
      const obj = { id: String(idCounter++), name: displayName };
      if (lowerName.includes('jute')) {
        groups["JUTE BAGS"].push(obj);
      } else if (lowerName.includes('2d pouch')) {
        groups["2D POUCHES"].push(obj);
      } else if (lowerName.includes('3d pouch')) {
        groups["3D POUCHES"].push(obj);
      } else if (lowerName.includes('centre seal')) {
        groups["CENTRE SEAL POUCHES"].push(obj);
      } else if (lowerName.includes('pp') || lowerName.includes('bopp') || lowerName.includes('fabric') || lowerName.includes('non-woven')) {
        groups["PP / BOPP BAGS"].push(obj);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    let responseData = groups;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(groups).find(k => k.toUpperCase().includes(q));
      if (key) responseData = groups[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get just the variety groups
// @route   GET /api/bot/menus/variety-groups
// @access  Public
const getVarietyGroups = async (req, res, next) => {
  try {
    const groups = [
      { id: "1", name: "BASMATI" },
      { id: "2", name: "NON-BASMATI" }
    ];
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};
// @desc    Get dynamic rice varieties grouped by Basmati/Non-Basmati
// @route   GET /api/bot/menus/varieties
// @access  Public
const getDynamicVarieties = async (req, res, next) => {
  try {
    const distinctVarieties = await Exmill.distinct('variety');

    const groups = {
      "BASMATI": [],
      "NON-BASMATI": []
    };

    let idCounter = 1;
    distinctVarieties.forEach(v => {
      const obj = { id: String(idCounter++), name: v };
      if (v.toLowerCase().includes('basmati')) {
        groups["BASMATI"].push(obj);
      } else {
        groups["NON-BASMATI"].push(obj);
      }
    });

    let responseData = groups;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(groups).find(k => k.toUpperCase().includes(q));
      if (key) responseData = groups[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get just the form groups
// @route   GET /api/bot/menus/form-groups
// @access  Public
const getFormGroups = async (req, res, next) => {
  try {
    const groups = [
      { id: "1", name: "PROCESSING METHOD" }
    ];
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic processing forms optionally filtered by variety
// @route   GET /api/bot/menus/forms
// @access  Public
const getDynamicForms = async (req, res, next) => {
  try {
    const { variety } = req.query;
    let filter = {};
    if (variety) {
      // case insensitive exact match
      filter.variety = { $regex: new RegExp(`^${variety.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') };
    }

    const distinctForms = await Exmill.find(filter).distinct('form');
    const mappedForms = mapWithSequentialId(distinctForms);

    const groups = {
      "PROCESSING METHOD": mappedForms
    };

    let responseData = groups;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(groups).find(k => k.toUpperCase().includes(q));
      if (key) responseData = groups[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Create new lead from bot
// @route   POST /api/bot/lead
// @access  Public
const createLeadBot = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, companyName, country, city, contactPerson, phone } = req.body;

    const lead = await Lead.create({
      contactPerson: fullName || contactPerson,
      phone: mobileNumber || phone,
      companyName: companyName || 'Unknown Company',
      country,
      city,
      status: 'New'
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to get settings safely
const getSettingsDoc = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    try {
      settings = await Setting.create({});
    } catch (e) {
      // Ignore unique constraint errors if created concurrently
    }
  }
  return settings || {};
};


// --- CIF APIs ---

// Helper for Region mapping
const getRegionForCountry = (countryStr) => {
  const c = countryStr.toLowerCase();

  const middleEast = ['uae', 'saudi', 'oman', 'qatar', 'kuwait', 'bahrain', 'iraq', 'iran', 'yemen', 'lebanon', 'jordan', 'syria', 'israel', 'palestine', 'dubai', 'abu dhabi'];
  const europe = ['uk', 'germany', 'france', 'italy', 'spain', 'netherland', 'belgium', 'russia', 'sweden', 'norway', 'poland', 'europe', 'ireland', 'portugal', 'greece', 'swiss', 'austria', 'denmark', 'finland'];
  const africa = ['africa', 'nigeria', 'kenya', 'egypt', 'morocco', 'ghana', 'tanzania', 'djibouti', 'somalia', 'senegal', 'ivory coast', 'cameroon', 'sudan', 'uganda', 'algeria', 'angola', 'mozambique', 'madagascar'];
  const asia = ['turkey', 'china', 'malaysia', 'singapore', 'indonesia', 'vietnam', 'philippine', 'bangladesh', 'sri lanka', 'thai', 'korea', 'japan', 'india', 'pakistan', 'nepal', 'myanmar', 'taiwan'];
  const americas = ['usa', 'canada', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'america', 'caribbean', 'cuba', 'jamaica', 'panama', 'ecuador', 'venezuela', 'uruguay'];
  const oceania = ['australia', 'new zealand', 'fiji', 'png', 'papua', 'samoa'];

  if (middleEast.some(x => c.includes(x))) return "Middle East";
  if (europe.some(x => c.includes(x))) return "EU Europe";
  if (africa.some(x => c.includes(x))) return "Africa";
  if (asia.some(x => c.includes(x))) return "Asia";
  if (americas.some(x => c.includes(x))) return "Americas";
  if (oceania.some(x => c.includes(x))) return "AU Oceania";

  return "Other";
};

// @desc    Get hardcoded regions for CIF
// @route   GET /api/bot/menus/regions
// @access  Public
const getDynamicRegions = async (req, res, next) => {
  try {
    const regions = [
      "Middle East",
      "EU Europe",
      "Africa",
      "Asia",
      "Americas",
      "AU Oceania"
    ];

    const mappedRegions = mapWithSequentialId(regions);

    const groups = {
      "REGION": mappedRegions
    };

    let responseData = groups;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(groups).find(k => k.toUpperCase().includes(q));
      if (key) responseData = groups[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// Sub-region mapping helper
const getSubRegion = (region, countryStr) => {
  const c = countryStr.toLowerCase();
  if (region === 'Middle East') {
    if (['uae', 'saudi', 'qatar', 'bahrain', 'kuwait', 'oman', 'dubai', 'abu dhabi'].some(x => c.includes(x))) return 'GULF';
    return 'LEVANT & YEMEN';
  }
  if (region === 'EU Europe') {
    if (['russia', 'sweden', 'norway', 'denmark', 'finland'].some(x => c.includes(x))) return 'NORDICS & RUSSIA';
    return 'EU & UK';
  }
  if (region === 'Africa') {
    if (['south africa', 'kenya', 'tanzania', 'uganda', 'mozambique', 'madagascar', 'somalia', 'djibouti'].some(x => c.includes(x))) return 'EAST & SOUTH AFRICA';
    return 'WEST & NORTH AFRICA';
  }
  if (region === 'Asia') {
    if (['turkey', 'india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal'].some(x => c.includes(x))) return 'SOUTH ASIA & TURKEY';
    return 'ASEAN & CHINA';
  }
  if (region === 'Americas') {
    if (['usa', 'canada', 'mexico'].some(x => c.includes(x))) return 'NORTH AMERICA';
    return 'LATAM & CARIBBEAN';
  }
  return 'OCEANIA';
};

// @desc    Get just the country sub-regions
// @route   GET /api/bot/menus/country-groups
// @access  Public
const getCountryGroups = async (req, res, next) => {
  try {
    const { region } = req.query;
    const allFreights = await Freight.find().select('country');

    const subRegionsSet = new Set();

    allFreights.forEach(f => {
      const fRegion = getRegionForCountry(f.country);
      if (!region || region === 'Other' || fRegion === region) {
        subRegionsSet.add(getSubRegion(fRegion, f.country));
      }
    });

    const groups = Array.from(subRegionsSet).sort().map((sr, index) => ({ id: String(index + 1), name: sr }));

    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic countries/ports grouped by sub-region
// @route   GET /api/bot/menus/countries
// @access  Public
const getDynamicCountries = async (req, res, next) => {
  try {
    const { region } = req.query;

    const allFreights = await Freight.find().select('country portName');

    const groups = {};

    allFreights.forEach(f => {
      const fRegion = getRegionForCountry(f.country);
      if (!region || region === 'Other' || fRegion === region) {
        const subRegion = getSubRegion(fRegion, f.country);
        if (!groups[subRegion]) groups[subRegion] = new Set();
        const formatted = `${f.country} — ${f.portName}`;
        groups[subRegion].add(formatted);
      }
    });

    // Convert Sets to Arrays
    const formattedData = {};
    let idCounter = 1;
    for (const sub in groups) {
      const sortedEntries = Array.from(groups[sub]).sort((a, b) => a.localeCompare(b));
      formattedData[sub] = sortedEntries.map(name => ({ id: String(idCounter++), name }));
    }

    let responseData = formattedData;
    if (req.query.group) {
      const q = req.query.group.toUpperCase();
      const key = Object.keys(formattedData).find(k => k.toUpperCase().includes(q));
      if (key) responseData = formattedData[key];
      else responseData = [];
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Calculate general quote (EX MILL, FOB, CIF based on inputs)
// @route   POST /api/bot/quote
// @access  Public
const calculateQuote = async (req, res, next) => {
  try {
    let { variety, form, size, packType, country, portName, destination } = req.body;

    let targetCountry = country;
    let targetPort = portName;

    if (destination && (!targetCountry || !targetPort)) {
      const parts = destination.split('—').map(p => p.trim());
      if (parts.length === 2) {
        targetCountry = parts[0];
        targetPort = parts[1];
      }
    }

    if (!variety || !form || !size || !packType) {
      return res.status(400).json({ success: false, error: 'variety, form, size, and packType are required' });
    }

    const exmillData = await Exmill.findOne({
      variety: { $regex: new RegExp(`^${variety}$`, 'i') },
      form: { $regex: new RegExp(`^${form}$`, 'i') }
    });

    if (!exmillData || !exmillData.inrPerKg) {
      return res.status(404).json({ success: false, error: `ExMill rate not found for ${variety} - ${form}` });
    }

    const inrPerKg = exmillData.inrPerKg;
    const rawInrPerMt = inrPerKg * 1000;

    const settingsDoc = await getSettingsDoc();
    const rate = settingsDoc.usdInrRate || 93.5;
    const inlandInrPerMt = settingsDoc.inlandFreight || 2000;
    const customsInrPerContainer = settingsDoc.customsThc || 45000;

    const targetGrams = parseSizeInGrams(size);
    const flexiType = packType.replace(/[^a-zA-Z0-9]+/g, '.*');

    const allPacks = await Packaging.find({
      productName: { $regex: new RegExp(flexiType, 'i') }
    });

    const packData = allPacks.find(p => parseSizeInGrams(p.packSize) === targetGrams);

    if (!packData || !packData.mtCapacity || !packData.packagingRate) {
      return res.status(404).json({ success: false, error: `Packaging data not found for ${packType} - ${size}` });
    }

    const containerMt = packData.mtCapacity;
    const packInrPerUnit = packData.packagingRate;

    const sizeGrams = parseSizeInGrams(size) || 1000;
    const unitsPerMt = 1000000 / sizeGrams;

    let seaFreightUsdPerContainer = 0;
    let cocUsd = 0;
    let hasFreight = false;

    if (targetCountry && targetPort) {
      const freightData = await Freight.findOne({
        country: { $regex: new RegExp(`^${targetCountry}$`, 'i') },
        portName: { $regex: new RegExp(`^${targetPort}$`, 'i') }
      });

      if (!freightData) {
        return res.status(404).json({ success: false, error: `Freight data not found for ${targetCountry} - ${targetPort}` });
      }

      seaFreightUsdPerContainer = freightData.seaFreightUsd || 0;
      cocUsd = freightData.cocUsd || 0;
      hasFreight = true;
    }

    const roundTo5 = (num) => Math.round(num / 5) * 5;

    const rawExMillUsd = rawInrPerMt / rate;
    const rawInlandUsd = inlandInrPerMt / rate;
    const rawCustomsUsd = (customsInrPerContainer / rate) / containerMt;
    const rawPackUsd = (packInrPerUnit * unitsPerMt) / rate;

    const exMillUsdPerMt = roundTo5(rawExMillUsd);
    const inlandUsdPerMt = roundTo5(rawInlandUsd);
    const customsUsdPerMt = roundTo5(rawCustomsUsd);
    const packagingUsdPerMt = roundTo5(rawPackUsd);

    const fobUsdPerMt = exMillUsdPerMt + inlandUsdPerMt + customsUsdPerMt + packagingUsdPerMt;

    let totalSeaAndCocUsdPerMt = 0;
    let cifUsdPerMt = null;

    if (hasFreight) {
      const rawSeaFreightUsd = seaFreightUsdPerContainer / containerMt;
      const rawCocUsd = cocUsd / containerMt;

      const seaFreightUsdPerMt = roundTo5(rawSeaFreightUsd);
      const cocUsdPerMt = roundTo5(rawCocUsd);

      totalSeaAndCocUsdPerMt = seaFreightUsdPerMt + cocUsdPerMt;
      cifUsdPerMt = fobUsdPerMt + totalSeaAndCocUsdPerMt;
    }

    // Format Date
    const today = new Date();
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateString = today.toLocaleDateString('en-GB', dateOpts);

    let message = '';
    const destName = hasFreight ? `${targetCountry} — ${targetPort}` : '';

    if (hasFreight) {
      message += `📋 DCS CIF — ${destName} — Live Price Quote\n`;
    } else {
      message += `📋 DCS EX MILL / FOB — Live Price Quote\n`;
    }

    message += `📅 ${dateString}\n`;
    message += `Source updated: 24 Apr 2026 (demo)\n\n`;

    message += `🌾 ${variety} — ${form}\n`;
    message += `📦 Size: ${size} | Packaging: ${packType}\n`;
    if (hasFreight) {
      message += `🌍 Destination: ${destName}\n`;
    }
    message += `\n`;
    const inrPerMt = Math.round(rawInrPerMt / 100) * 100;
    const roundedInrPerKg = inrPerMt / 1000;
    const inrPerMtStr = inrPerMt.toLocaleString('en-IN');

    message += `💵 Mill-Gate Price:\n`;
    message += `• ₹${inrPerMtStr} / MT (≈ ₹${roundedInrPerKg} / kg)\n`;
    message += `• $${exMillUsdPerMt} USD/MT (reference @ USD/INR ${rate})\n\n`;

    message += `🚢 FOB: $${fobUsdPerMt} USD/MT\n`;
    if (hasFreight) {
      message += `📦 CIF ${destName}: $${cifUsdPerMt} USD/MT\n`;
    }
    message += `\n`;

    message += `FOB build-up (USD/MT):\n`;
    message += `• Ex-Mill $${exMillUsdPerMt}\n`;
    message += `• Inland Freight $${inlandUsdPerMt}\n`;
    message += `• Customs + THC $${customsUsdPerMt}\n`;
    message += `• Packaging cost $${packagingUsdPerMt}\n`;
    message += `• Total FOB $${fobUsdPerMt}\n\n`;

    if (hasFreight) {
      message += `CIF build-up to ${destName} (USD/MT):\n`;
      message += `• FOB $${fobUsdPerMt}\n`;
      message += `• Sea Freight $${totalSeaAndCocUsdPerMt}\n`;
      message += `• Total CIF $${cifUsdPerMt}\n\n`;
    }

    message += `Min. order: 1 × 20' FCL\n`;
    message += `Container loading: ${containerMt} MT (depends on bag type)\n`;
    message += `All figures rounded to the nearest USD 5 / MT for clarity.\n\n`;

    message += `⚠️ Prices computed at USD/INR ${rate}`;

    res.status(200).json({
      success: true,
      data: {
        variety,
        form,
        size,
        packType,
        destination: hasFreight ? destName : null,
        containerMt,
        inrPerMt,
        inrPerKg: roundedInrPerKg,
        exMillUsdPerMt,
        inlandUsdPerMt,
        customsUsdPerMt,
        packagingUsdPerMt,
        fobUsdPerMt,
        ...(hasFreight && {
          seaFreightUsdPerMt: totalSeaAndCocUsdPerMt,
          cifUsdPerMt
        }),
        rate,
        message
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSizeGroups,
  getDynamicSizes,
  getPackagingTypeGroups,
  getDynamicPackagingTypes,
  getVarietyGroups,
  getDynamicVarieties,
  getFormGroups,
  getDynamicForms,
  getDynamicRegions,
  getCountryGroups,
  getDynamicCountries,
  calculateQuote,
  createLeadBot
};
