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

module.exports = router;