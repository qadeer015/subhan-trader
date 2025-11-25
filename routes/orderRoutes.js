const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Checkout page
router.get('/', orderController.showCheckout);

// Submit checkout -> creates order and starts payment
router.post('/', orderController.createOrder);

// Success / failed views
router.get('/success/:id', orderController.orderSuccess);
router.get('/failed/:id', orderController.orderFailed);

module.exports = router;