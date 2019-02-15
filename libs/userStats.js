const mongoose = require('mongoose'),
      models = require('../models');

module.exports = function (id, created, picked, localized) {
  models.userStats.findOne({owner: id}, (err, doc) => {
    doc.created += created;
    doc.picked += picked;
    doc.localized += localized;
    doc.save();
  })
}