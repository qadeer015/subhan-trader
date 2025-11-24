const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

// Create a "payment session" and redirect to mock payment page
exports.createPaymentSession = async (req, res, next) => {
  try {
    const orderId = req.query.orderId;
    if (!orderId) return res.status(400).send('orderId required');

    const order = await Order.findById(orderId).populate('items').lean();
    if (!order) return res.status(404).send('Order not found');

    // For real provider, create session and provide URL. We'll render a mock payment page with buttons.
    res.render('paymentMock', { order });
  } catch (err) {
    next(err);
  }
};

// Simulate payment success redirect callback (this would be handled by gateway)
exports.mockPaymentResult = async (req, res, next) => {
  try {
    // Simulated flow: POST from mock payment form with orderId and result=success|fail
    const { orderId, result } = req.body;
    if (!orderId) return res.status(400).send('orderId missing');

    if (result === 'success') {
      // In a real webhook you'd verify signature. We'll call webhook handler function directly here.
      // Update order status = paid, reduce stock, clear cart, store payment details
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send('Order not found');

      order.paymentStatus = 'paid';
      order.orderStatus = 'paid';
      order.paymentMethod = 'mock';
      order.paymentDetails = { provider: 'mock', transactionId: `mock_tx_${Date.now()}` };
      await order.save();

      // Reduce product stock for each order item
      const orderItems = await OrderItem.find({ orderId: order._id }).lean();
      for (const oi of orderItems) {
        await Product.findByIdAndUpdate(oi.productId, { $inc: { stock: -oi.quantity } });
      }

      // Clear user/session cart
      const filter = order.userId ? { userId: order.userId } : { sessionId: req.session.cartSessionId };
      await CartItem.deleteMany(filter);

      // Redirect to invoice page
      return res.redirect(`/checkout/success/${order._id}`);
    } else {
      // payment failed
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send('Order not found');
      order.paymentStatus = 'failed';
      order.orderStatus = 'payment_failed';
      order.paymentDetails = { provider: 'mock', reason: 'user_failed' };
      await order.save();

      return res.redirect(`/checkout/failed/${order._id}`);
    }
  } catch (err) {
    next(err);
  }
};

// Webhook endpoint (simulate external provider calling)
exports.webhook = async (req, res, next) => {
  try {
    const { orderId, status, providerData } = req.body;
    if (!orderId || !status) return res.status(400).json({ error: 'orderId and status required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status === 'paid') {
      if (order.paymentStatus === 'paid') return res.json({ ok: true, note: 'already paid' });
      order.paymentStatus = 'paid';
      order.orderStatus = 'paid';
      order.paymentDetails = providerData || { provider: 'mock', transactionId: `webhook_${Date.now()}` };
      await order.save();

      // Deduct stock
      const orderItems = await OrderItem.find({ orderId: order._id }).lean();
      for (const oi of orderItems) {
        await Product.findByIdAndUpdate(oi.productId, { $inc: { stock: -oi.quantity } });
      }

      // Clear cart
      const filter = order.userId ? { userId: order.userId } : { sessionId: req.session.cartSessionId };
      await CartItem.deleteMany(filter);

      return res.json({ ok: true });
    } else {
      order.paymentStatus = 'failed';
      order.orderStatus = 'payment_failed';
      order.paymentDetails = providerData || { provider: 'mock', note: 'failed' };
      await order.save();
      return res.json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};