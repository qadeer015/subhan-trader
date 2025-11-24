const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const calculateTotals = require('../utils/calculateTotals');

function getFilterForReq(req) {
  return req.session.user ? { userId: req.session.user._id } : { sessionId: req.session.cartSessionId };
}

// Show cart
exports.showCart = async (req, res, next) => {
  try {
    const filter = getFilterForReq(req);
    const items = await CartItem.find(filter).populate('productId').lean();
    const cartItems = items.map(it => ({
      _id: it._id,
      product: it.productId,
      quantity: it.quantity
    }));

    const totals = calculateTotals(cartItems);
    res.render('cart', { cartItems, totals, currentUser: req.session.user });
  } catch (err) {
    next(err);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Math.max(1, parseInt(quantity || '1', 10));

    // Validate product exists and stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < qty) {
      // still allow adding but warn? For simplicity, restrict
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const filter = getFilterForReq(req);
    filter.productId = productId;

    let cartItem = await CartItem.findOne(filter);
    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      const payload = {
        productId,
        quantity: qty
      };
      if (req.session.user) payload.userId = req.session.user._id;
      else payload.sessionId = req.session.cartSessionId;

      cartItem = await CartItem.create(payload);
    }

    if (req.accepts('html')) {
      return res.redirect('/cart');
    }
    res.json({ success: true, cartItem });
  } catch (err) {
    next(err);
  }
};

// Update quantity
exports.updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const qty = Math.max(1, parseInt(quantity || '1', 10));

    const item = await CartItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    // check stock
    const product = await Product.findById(item.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (qty > product.stock) return res.status(400).json({ error: 'Not enough stock' });

    item.quantity = qty;
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    if (req.accepts('html')) {
      return res.redirect('/cart');
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};