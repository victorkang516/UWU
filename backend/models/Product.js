const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  countInStock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    default:  "https://mpama.com/wp-content/uploads/2017/04/default-image.jpg"
  },
  shopId: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  }
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;