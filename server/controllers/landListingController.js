const { LandListing, User } = require('../models');
const { Op } = require('sequelize');

// Get all listings with filtering
exports.getAllListings = async (req, res) => {
  try {
    const { region, type, min_size, max_price, owner_id } = req.query;
    let whereClause = { is_available: true };

    if (region) whereClause.region = region;
    if (type) whereClause.type = type;
    if (owner_id) whereClause.owner_id = owner_id;
    if (min_size) whereClause.size = { [Op.gte]: min_size };
    if (max_price) whereClause.price = { [Op.lte]: max_price };

    const listings = await LandListing.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'is_verified']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching land listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await LandListing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone', 'is_verified']
        }
      ]
    });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, location, region, size, price, type, images } = req.body;

    const newListing = await LandListing.create({
      title,
      description,
      location,
      region,
      size,
      price,
      type,
      images,
      owner_id: req.user.id
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating land listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await LandListing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
