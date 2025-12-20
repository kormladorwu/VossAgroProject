const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// GET all products (Public)
router.get('/', productController.getAllProducts);

// GET a single product by ID (Public)
router.get('/:id', productController.getProductById);

// POST create a new product (Protected, Farmers only)
router.post('/', protect, productController.createProduct);

// PUT update a product by ID (Protected, Owner only)
router.put('/:id', protect, productController.updateProduct);

// DELETE a product by ID (Protected, Owner only)
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
