const { v4: uuidv4 } = require('uuid');
const CartItem = require('../models/CartItem');

module.exports = async function sessionCart(req, res, next) {
  try {
    // Ensure a sessionId for guest cart
    if (!req.session.cartSessionId) {
      req.session.cartSessionId = uuidv4();
    }

    // Expose cart summary helper on response locals later (populated in controllers)
    res.locals.sessionId = req.session.cartSessionId;
    res.locals.currentUser = req.session.user || null;

    // Attach simple helper to get cart count (async)
    req.getCartCount = async function() {
      const filter = req.session.user ? { userId: req.session.user._id } : { sessionId: req.session.cartSessionId };
      const items = await CartItem.find(filter).lean();
      return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    };

    next();
  } catch (err) {
    next(err);
  }
};