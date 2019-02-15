const mongoose = require('mongoose'),
      models = require('../models');

module.exports = function (id, diff) {
  models.user.findById(id, (err, doc) => {
    doc.coins += diff;
    doc.save();
  })
}