const router = require('express').Router(),
      models = require('../models'),
      money = require('../libs/coins'),
      userStats = require('../libs/userStats'),
      driverStats = require('../libs/driverStats'),
      notify = require('../libs/notify');

router.post('/add', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) {
   data.ok = false;
   res.send(data);
   return; 
  }
  models.marker.create({
    pos: req.body.pos,
    icon: req.body.icon,
    author: req.session.user_id
  }).then(function (el) {
    money(req.session.user_id, 5);
    userStats(req.session.user_id, 1, 0, 0);
    data.id = el._id;
    res.send(data);
  }).catch(function () {
    data.ok = false;
    res.send(data);
  });
});

router.post('/remove', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) {
   data.ok = false;
   res.send(data);
   return; 
  }
  models.marker.findById(req.body.id, (err, marker) => {
    if (err) data.ok = false;
    if (!marker) return;
    if (marker.author != req.session.user_id && req.session.user_role == 'user') {
      data.ok = false;
      data.message = 'Ви не маєте права видаляти чужі мітки.';
    }
    if (!data.ok) return res.send(data), 0;
    if (req.session.user_role == 'driver') money(marker.author, -6), driverStats(marker.author, 1, 0, 0);
    else money(marker.author, -5);
    marker.remove();
    res.send(data);
  })
});

router.post('/pick', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) {
   data.ok = false;
   res.send(data);
   return; 
  }
  models.marker.findById(req.body.id, (err, marker) => {
    if (err) data.ok = false;
    if (!marker) return;
    if (marker.author != req.session.user_id && req.session.user_role == 'user') {
      data.ok = false;
      data.message = 'Ви не маєте права видаляти чужі мітки.';
    }
    money(marker.author, 15);
    userStats(marker.author, 0, 1, 0);
    driverStats(req.session.user_id, 1, 1, 0);
    notify.picked(marker.author);
    if (!data.ok) return res.send(data), 0;
    marker.remove();
    res.send(data);
  })
});

router.post('/localize', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) {
   data.ok = false;
   res.send(data);
   return; 
  }
  models.marker.findById(req.body.id, (err, marker) => {
    if (err) data.ok = false;
    if (!marker) return;
    if (marker.author != req.session.user_id && req.session.user_role == 'user') {
      data.ok = false;
      data.message = 'Ви не маєте права видаляти чужі мітки.';
    }
    money(marker.author, 15);
    userStats(marker.author, 0, 0, 1);
    driverStats(req.session.user_id, 1, 0, 1);
    notify.localized(marker.author);
    if (!data.ok) return res.send(data), 0;
    marker.remove();
    res.send(data);
  })
});

router.get('/get', (req, res) => {
  var data = {
    ok: true,
    markers: []
  };
  if (!req.session.user_id) {
   data.ok = false;
   res.send(data);
   return; 
  }
  models.marker.find({}, (err, markersMap) => {
    if (err) data.ok = false;
    else {
      markersMap.forEach(markerEx => {
        var marker = {
          pos: markerEx.pos,
          icon: markerEx.icon,
          author: markerEx.author,
          id: markerEx._id
        }
        data.markers.push(marker);
      });
    }
    res.send(data);
  });
});

module.exports = router;
