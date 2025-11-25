const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }], // references
  totalAmount: { type: Number, required: true, min: 0 },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  deliveryCharges: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: null },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending','paid','packed','shipped','delivered','cancelled','payment_failed'], default: 'pending' },
  paymentDetails: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);