const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);
router.post('/add', categoryController.create);
router.post('/delete/:id', categoryController.delete);

module.exports = router;
