var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DriverStat = new Schema({
  owner: {
    type: String,
    unique: true
  },
  operated: {
    type: Number,
    default: 0
  },
  picked: {
    type: Number,
    default: 0
  },
  localized: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('DriverStat', DriverStat);