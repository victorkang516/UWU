const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    trim: true,
    default: "https://bootdey.com/img/Content/avatar/avatar3.png"
  },
  totalSpent: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
