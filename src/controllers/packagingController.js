const Packaging = require('../models/Packaging');

// Get all packaging entries
exports.getAllPackaging = async (req, res) => {
  try {
    const data = await Packaging.find().sort({ productName: 1, packSize: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packaging data', error: error.message });
  }
};

// Create a new packaging entry
exports.createPackaging = async (req, res) => {
  try {
    const newEntry = new Packaging(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A record with this Product Name and Pack Size already exists.' });
    }
    res.status(400).json({ message: 'Error creating packaging entry', error: error.message });
  }
};

// Update an existing packaging entry
exports.updatePackaging = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = await Packaging.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Packaging entry not found' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A record with this Product Name and Pack Size already exists.' });
    }
    res.status(400).json({ message: 'Error updating packaging entry', error: error.message });
  }
};

// Delete a packaging entry
exports.deletePackaging = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await Packaging.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Packaging entry not found' });
    }
    res.status(200).json({ message: 'Packaging entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting packaging entry', error: error.message });
  }
};

// Bulk insert/update (for seeder/import)
exports.bulkUpsertPackaging = async (req, res) => {
  try {
    const { data } = req.body; // array of { productName, packSize, mtCapacity, packagingRate }
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid data format. Expected array of packaging objects.' });
    }

    const bulkOps = data.map(item => ({
      updateOne: {
        filter: { productName: item.productName, packSize: item.packSize },
        update: { $set: item },
        upsert: true
      }
    }));

    const result = await Packaging.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Bulk upsert completed', result });
  } catch (error) {
    res.status(500).json({ message: 'Error in bulk upsert', error: error.message });
  }
};
