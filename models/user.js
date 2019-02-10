var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  name: {
    type: String,
    required: true,
    default: 'Натисніть щоб вказати'
  },
  address: {
    type: String,
    required: true,
    default: 'Натисніть щоб вказати'
  }
});

module.exports = mongoose.model('User', User);