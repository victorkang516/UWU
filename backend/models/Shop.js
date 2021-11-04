const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  shopDescription: {
    type: String,
    required: true
  },
  shopImageUrl: {
    type: String
  },
  shopAddress: {
    type: String,
    required: true
  },
  shopPhone: {
    type: String,
    required: true
  },
  shopEmail: {
    type: String,
    reuired: true
  }
});

const Shop = mongoose.model('shop', shopSchema);

module.exports = Shop;