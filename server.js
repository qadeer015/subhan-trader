// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./config/db'); // MySQL connection pool
const Product = require('./models/Product');
const Category = require('./models/Category');

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

require('dotenv').config({
  quiet: true
});

require('./config/passport');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// server.js
const sessionStore = new MySQLStore({
  expiration: 86400000, // 1 day in milliseconds
  createDatabaseTable: true, // Will create sessions table if it doesn't exist
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, pool);

app.set('trust proxy', 1); // very important on Vercel/Heroku/behind proxies

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport and flash middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables middleware (must come after flash)
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Make user available in all views
    next();
});

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
            condition,
            user: req.user // Pass user to view
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
            condition,
            user: req.user // Pass user to view
        });
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Search failed');
        res.redirect('/');
    }
});

// Routes
app.use('/', pageRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/contact', contactRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash('error', 'Something went wrong!');
    res.status(500).redirect('/');
});

app.listen(process.env.PORT , () => console.log(`Server running on http://localhost:${process.env.PORT }`));