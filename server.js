const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const flash = require('connect-flash');
const session = require('express-session');
const Product = require('./models/Product');
const Category = require('./models/Category');
const productController = require('./controllers/productsController');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pageRoutes = require('./routes/pageRoutes');


// Enhanced Homepage with featured products, search and filters
app.get('/', async (req, res) => {
    try {
        // Explicitly convert all numeric parameters
        let featuredProducts = await Product.getTopRated(4, 5);
        const categories = await Category.getAll();
        let latestProducts = await Product.getLatest(8);
        
        const searchQuery = req.query.search || '';
        const selectedCategory = req.query.category || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 1000;
        const condition = req.query.condition || '';
        featuredProducts = featuredProducts.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseFloat(product.price).toFixed(2)
        }));
        latestProducts = latestProducts.map(product => ({
            ...product,
            rating: parseFloat(product.rating).toFixed(1),
            price: parseFloat(product.price).toFixed(2)
        }));

        res.render('home', {
            title: 'Home',
            featuredProducts,
            latestProducts,
            categories,
            searchQuery,
            selectedCategory,
            minPrice,
            maxPrice,
            condition
        });
    } catch (error) {
        console.error('Homepage error:', error);
        req.flash('error', 'Failed to load homepage');
        res.redirect('/products');
    }
});

// Search endpoint
app.get('/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, condition } = req.query;
        
        const products = await Product.search({
            query: q,
            categoryId: category,
            minPrice: parseFloat(minPrice),
            maxPrice: parseFloat(maxPrice),
            condition
        });
        
        const categories = await Category.getAll();
        
        res.render('products/search', {
            title: 'Search Results',
            products,
            categories,
            searchQuery: q,
            selectedCategory: category,
            minPrice,
            maxPrice,
            condition
        });
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Search failed');
        res.redirect('/');
    }
});

app.use('/', pageRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/contact', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));