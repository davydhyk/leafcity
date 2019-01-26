var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Marker = new Schema({
  pos: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    }
  },
  icon: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Marker', Marker);