const Order = require('../models/Order');

// View all orders
exports.listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.render('adminOrders', { orders, currentUser: req.session.user });
  } catch (err) {
    next(err);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending','paid','packed','shipped','delivered','cancelled','payment_failed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.orderStatus = status;
    if (status === 'paid') order.paymentStatus = 'paid';
    await order.save();
    res.redirect('/admin/orders');
  } catch (err) {
    next(err);
  }
};