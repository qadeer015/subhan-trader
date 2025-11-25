const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const calculateTotals = require('../utils/calculateTotals');

// Show checkout form
exports.showCheckout = async (req, res, next) => {
  try {
    const filter = req.session.user ? { userId: req.session.user._id } : { sessionId: req.session.cartSessionId };
    const items = await CartItem.find(filter).populate('productId').lean();
    const cartItems = items.map(it => ({ product: it.productId, quantity: it.quantity }));
    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }
    const totals = calculateTotals(cartItems);
    res.render('checkout', { cartItems, totals, currentUser: req.session.user });
  } catch (err) {
    next(err);
  }
};

// Create order (before payment)
exports.createOrder = async (req, res, next) => {
  try {
    const filter = req.session.user ? { userId: req.session.user._id } : { sessionId: req.session.cartSessionId };
    const cartItems = await CartItem.find(filter).populate('productId').lean();
    if (!cartItems || cartItems.length === 0) return res.status(400).send('Cart is empty');

    // Calculate totals
    const itemsForCalc = cartItems.map(ci => ({ product: ci.productId, quantity: ci.quantity }));
    const totals = calculateTotals(itemsForCalc, {
      deliveryCharges: req.body.deliveryCharges ? Number(req.body.deliveryCharges) : undefined,
      discountAmount: req.body.discount ? Number(req.body.discount) : undefined
    });

    // Create Order (status pending)
    const order = await Order.create({
      userId: req.session.user ? req.session.user._id : null,
      items: [],
      totalAmount: totals.total,
      shippingAddress: {
        fullName: req.body.fullName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        phone: req.body.phone
      },
      deliveryCharges: totals.deliveryCharges,
      discount: totals.discount,
      paymentMethod: null,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    // Create order items and attach
    const orderItemsCreated = [];
    for (const ci of cartItems) {
      const price = ci.productId.price;
      const orderItem = await OrderItem.create({
        orderId: order._id,
        productId: ci.productId._id,
        quantity: ci.quantity,
        priceAtPurchase: price
      });
      orderItemsCreated.push(orderItem);
      order.items.push(orderItem._id);
    }
    await order.save();

    // Create a payment session token (redirect to payment)
    // For real gateway, you'd call provider API. We'll return the order id so front-end or payment route can start.
    res.redirect(`/payment/session?orderId=${order._id}`);
  } catch (err) {
    next(err);
  }
};

// Order invoice display (after success)
exports.orderSuccess = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'items',
      populate: { path: 'productId' }
    }).lean();
    if (!order) return res.status(404).send('Order not found');
    res.render('orderSuccess', { order, currentUser: req.session.user });
  } catch (err) {
    next(err);
  }
};

exports.orderFailed = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).send('Order not found');
    res.render('orderFailed', { order, currentUser: req.session.user });
  } catch (err) {
    next(err);
  }
};