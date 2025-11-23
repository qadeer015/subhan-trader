// routes/pageRoutes.js
const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    res.render('pages/about', { title: 'About Us' });
});

router.get('/faqs', (req, res) => {
    res.render('pages/faq', { title: 'FAQs' });
});

router.get('/privacy-policy', (req, res) => {
    res.render('pages/privacy', { title: 'Privacy Policy' });
});

router.get('/terms', (req, res) => {
    res.render('pages/terms', { title: 'Terms and Conditions' });
});

router.get('/order-tracking', (req, res) => {
    res.render('pages/track-order', { title: 'Order Tracking' });
});

router.get('/returns-and-refunds', (req, res) => {
    res.render('pages/return-refund-policy', { title: 'Returns and Refunds' });
});


router.get('/payment-methods', (req, res) => {
    res.render('pages/payment', { title: 'Payment Methods' });
});


router.get('/shipping-and-delivery', (req, res) => {
    res.render('pages/shipping-and-delivery', { title: 'Shipping and Delivery' });
});

router.get('/order-cancellation-policy', (req, res) => {
    res.render('pages/order-cancellation-policy', { title: 'Order Cancellation Policy' });
});



module.exports = router;
