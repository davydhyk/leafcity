const mongoose = require('mongoose'),
      models = require('../models');

module.exports = function (id, operated, picked, localized) {
  models.driverStats.findOne({owner: id}, (err, doc) => {
    doc.operated += operated;
    doc.picked += picked;
    doc.localized += localized;
    doc.save();
  })
}