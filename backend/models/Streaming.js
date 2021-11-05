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
  }
});

const Streaming = mongoose.model('streaming', streamingSchema);

module.exports = Streaming;