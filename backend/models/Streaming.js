const mongoose = require('mongoose');

const streamingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  productId: {
    type: String
  },
  isAuction: {
    type: Boolean,
    required: true
  },
  isAuctionStarted: {
    type: Boolean,
    default: false
  },
  minimumBid: {
    type: Number,
    default: 0
  },
  bidderId: {
    type: String,
    default: ""
  },
  bidderName: {
    type: String,
    default: ""
  },
  isAuctionEnded: {
    type: Boolean,
    default: false
  }
});

const Streaming = mongoose.model('streaming', streamingSchema);

module.exports = Streaming;