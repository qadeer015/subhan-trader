const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const multer = require('multer');
// const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Set up image upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/products');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Public routes
router.get('/', productController.list);
router.get('/category/:categoryId', productController.listByCategory);
router.get('/:id', productController.show);

// Protected routes (require authentication)
// router.use(ensureAuthenticated);

// Admin routes (require admin privileges)
// router.use(ensureAdmin);

router.get('/create/new', productController.createForm);
router.post('/create', upload.single('image'), productController.create);
router.get('/:id/edit', productController.editForm);
router.post('/:id/update', upload.single('image'), productController.update);
router.post('/:id/delete', productController.delete);

module.exports = router;