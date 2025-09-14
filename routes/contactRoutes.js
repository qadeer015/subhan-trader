const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.showForm);
router.post('/submit', contactController.submit);

module.exports = router;
