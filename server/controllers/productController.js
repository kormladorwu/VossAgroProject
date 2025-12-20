const { Product, User } = require('../models');
const { Op } = require('sequelize');

// Get all products with filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { region, category, search } = req.query;
    let whereClause = {};

    if (region) whereClause.region = region;
    if (category) whereClause.category = category;
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'region', 'is_verified']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'region', 'phone', 'is_verified']
        }
      ]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Ensure user is a farmer
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can list products' });
    }

    const { name, category, description, price, unit, quantity_available, region, images, harvest_date } = req.body;

    // Sanitize inputs
    const sanitizedHarvestDate = harvest_date === '' ? null : harvest_date;
    const sanitizedPrice = isNaN(parseFloat(price)) ? 0 : parseFloat(price);
    const sanitizedQuantity = isNaN(parseInt(quantity_available)) ? 0 : parseInt(quantity_available);

    const newProduct = await Product.create({
      name,
      category,
      description,
      price: sanitizedPrice,
      unit,
      quantity_available: sanitizedQuantity,
      region: region || req.user.region, // Default to user's region if not provided
      images,
      harvest_date: sanitizedHarvestDate,
      seller_id: req.user.id
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.seller_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.seller_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
