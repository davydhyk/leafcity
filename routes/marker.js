const router = require('express').Router(),
      models = require('../models');

router.post('/add', (req, res) => {
  var data = {
    ok: true
  }
  models.marker.create({
    pos: req.body.pos,
    icon: req.body.icon,
    author: req.session.user_id
  }).then(function () {
    res.send(data);
  }).catch(function () {
    data.ok = false;
    res.send(data);
  });
});

router.get('/get', (req, res) => {
  var data = {
    ok: true,
    markers: []
  };
  models.marker.find({}, (err, markersMap) => {
    if (err) data.ok = false;
    else {
      markersMap.forEach(markerEx => {
        var marker = {
          pos: markerEx.pos,
          icon: markerEx.icon,
          author: markerEx.author
        }
        data.markers.push(marker);
      });
    }
    res.send(data);
  });
});

module.exports = router;