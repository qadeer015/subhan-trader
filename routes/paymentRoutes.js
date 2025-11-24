const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment session and render payment page
router.get('/session', paymentController.createPaymentSession);

// Mock result endpoint (form submission from mock payment)
router.post('/mock-result', paymentController.mockPaymentResult);

// Webhook
router.post('/webhook', paymentController.webhook);

module.exports = router;