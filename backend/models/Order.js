const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  shopId: {
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
  },
  isAuctionItem: {
    type: Boolean,
    default: false
  },
  bidPrice: {
    type: Number,
    default: 0
  }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;