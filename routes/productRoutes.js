const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');

// Public routes
router.get('/', productController.list);
router.get('/category/:categoryId', productController.listByCategory);
router.get('/:id', productController.show);

module.exports = router;