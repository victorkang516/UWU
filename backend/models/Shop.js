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
    type: String,
    trim: true,
    default: "https://p.kindpng.com/picc/s/9-94468_shop-clipart-hd-png-download.png"
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