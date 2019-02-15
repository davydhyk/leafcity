var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  owner: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Notification', Notification);