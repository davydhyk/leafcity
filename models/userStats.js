var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserStat = new Schema({
  owner: {
    type: String,
    unique: true
  },
  created: {
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

module.exports = mongoose.model('UserStat', UserStat);