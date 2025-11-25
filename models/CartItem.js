const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  sessionId: { type: String, index: true }, // for guest carts
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // optional
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { timestamps: true });

cartItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true, partialFilterExpression: { sessionId: { $exists: true } } });

module.exports = mongoose.model('CartItem', cartItemSchema);