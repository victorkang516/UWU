const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  rank: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const Membership = mongoose.model('membership', membershipSchema);

module.exports = Membership;