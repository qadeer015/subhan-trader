const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const sessionCart = require('./middleware/sessionCart');

const app = express();
const PORT = process.env.PORT || 3000;

// DB connect
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/subhan_trader';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// View engine and static
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// session-based cart: attach sessionId and ensure cart persisted across requests
app.use(sessionCart);

// Routes
app.use('/', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

// Basic root redirect
app.get('/', (req, res) => {
  res.redirect('/products');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (req.accepts('html')) {
    res.render('error', { error: err });
  } else {
    res.json({ error: err.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});