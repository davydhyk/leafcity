const mongoose = require('mongoose'),
      models = require('../models');
      
var picked = function (id) {
  models.notify.create({
    owner: id,
    icon: 'img/noti/home.png',
    title: 'Листя вивезено',
    text: 'Листя вивезено з позначеного місця, на ваш рахунок нараховано 15 монет. Дякуємо за допомогу'
  })
}

var localized = function (id) {
  models.notify.create({
    owner: id,
    icon: 'img/noti/fire.png',
    title: 'Підпал локалізовано',
    text: 'Дякуємо за звертання. Завдяки вам ми зробимо місто чистішим.'
  })
}

module.exports = {
  picked,
  localized
}
