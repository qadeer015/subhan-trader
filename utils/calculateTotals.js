// Utility to calculate subtotal, delivery charges, discount, total
function calculateTotals(cartItems, options = {}) {
  // cartItems: array of { product: { price }, quantity }
  const subtotal = cartItems.reduce((sum, ci) => {
    const price = (ci.product && ci.product.price) ? ci.product.price : 0;
    return sum + price * (ci.quantity || 0);
  }, 0);

  // Basic shipping policy: free over 100, else 10
  const deliveryCharges = options.deliveryCharges != null ? options.deliveryCharges : (subtotal > 100 ? 0 : 10);

  // Discount: percent or flat
  let discount = 0;
  if (options.discountPercent) {
    discount = subtotal * (options.discountPercent / 100);
  } else if (options.discountAmount) {
    discount = options.discountAmount;
  }

  const total = Math.max(0, subtotal + deliveryCharges - discount);

  return { subtotal, deliveryCharges, discount, total };
}

module.exports = calculateTotals;