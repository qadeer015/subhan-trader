const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Show cart
router.get('/', cartController.showCart);

// Add to cart (form or json)
router.post('/add', cartController.addToCart);

// Update quantity
router.put('/:id', cartController.updateQuantity);

// Remove
router.delete('/:id', cartController.removeFromCart);

module.exports = router;