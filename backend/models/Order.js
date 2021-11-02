const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;