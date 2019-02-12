const router = require('express').Router(),
      models = require('../models');

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
  }).then(function () {
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
