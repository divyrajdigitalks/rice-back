const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });
require('node:dns').setServers(['1.1.1.1', '8.8.8.8']);

const Packaging = require('./models/Packaging');
const dbConfig = require('./config/db');

// Read JSON data
const parsedDataPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\674adbed-93f5-476b-b8d9-9e2fe1a6d551\\scratch\\parsedData.json';
const data = JSON.parse(fs.readFileSync(parsedDataPath, 'utf-8'));

const section2 = data.section2;
const section3 = data.section3;

const getCombinedData = () => {
  const combined = {};
  
  // process section 2
  for (const [productName, sizes] of Object.entries(section2)) {
    if (!combined[productName]) combined[productName] = {};
    for (const [packSize, mtCapacity] of Object.entries(sizes)) {
      if (!combined[productName][packSize]) combined[productName][packSize] = {};
      combined[productName][packSize].mtCapacity = mtCapacity;
    }
  }

  // process section 3
  for (const [productName, sizes] of Object.entries(section3)) {
    if (!combined[productName]) combined[productName] = {};
    for (const [packSize, packagingRate] of Object.entries(sizes)) {
      if (!combined[productName][packSize]) combined[productName][packSize] = {};
      combined[productName][packSize].packagingRate = packagingRate;
    }
  }

  // flatten to array
  const result = [];
  for (const [productName, sizes] of Object.entries(combined)) {
    for (const [packSize, vals] of Object.entries(sizes)) {
      result.push({
        productName,
        packSize,
        mtCapacity: vals.mtCapacity || 0,
        packagingRate: vals.packagingRate || 0
      });
    }
  }
  return result;
};

const importData = async () => {
  try {
    await dbConfig();
    const formattedData = getCombinedData();
    console.log(`Prepared ${formattedData.length} records. Importing...`);
    
    // Clear existing to avoid duplicates if running multiple times
    await Packaging.deleteMany();
    await Packaging.insertMany(formattedData);

    console.log('Packaging Master Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
