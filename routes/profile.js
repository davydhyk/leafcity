const router = require('express').Router(),
      models = require('../models');

router.post('/name', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) return res.send(data);
  models.user.findById(req.session.user_id, (err, doc) => {
    if (err) return data.ok = false;
    doc.name = req.body.name;
    doc.save();
  });
  res.send(data);
});

router.post('/address', (req, res) => {
  var data = {
    ok: true
  }
  if (!req.session.user_id) return res.send(data);
  models.user.findById(req.session.user_id, (err, doc) => {
    if (err) return data.ok = false;
    doc.address = req.body.address;
    doc.save();
  });
  res.send(data);
});

module.exports = router;