const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.showForm);
router.post('/submit', contactController.submit);

// Admin routes to view/delete messages
router.get('/admin/messages', contactController.list);
router.post('/admin/messages/delete/:id', contactController.delete);

module.exports = router;
