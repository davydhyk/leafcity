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

router.post('/role', (req, res) => {
  var data = {ok: true}
  models.user.findById(req.body.id, (err, doc) => {
    if (err) {
      data.ok = false;
      return;
    }
    if (req.body.role == 'user') {
      doc.role = 'user';
      doc.save();
      return;
    } else if (req.body.role == 'driver' || req.body.role == 'admin') {
      models.driverStats.find({owner: req.body.id}, (err, docs) => {
        if (err) {
          data.ok = false;
          return;
        }
        if (!docs.length) models.driverStats.create({owner: req.body.id});
        doc.role = req.body.role;
        doc.save();
        return;
      })
    }
  });
  setTimeout(function () {res.send(data);}, 500);
});

router.post('/reset', (req, res) => {
  var data = {ok: true}
  models.user.findById(req.body.id, (err, doc) => {
    if (err) {
      data.ok = false;
      return;
    }
    doc.coins = 0;
    doc.save();
  })
  models.userStats.find({owner: req.body.id}, (err, docs) => {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.created = 0;
      doc.picked = 0;
      doc.localized = 0;
      doc.save();
    });
  })
  models.driverStats.find({owner: req.body.id}, (err, docs) => {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.operated = 0;
      doc.picked = 0;
      doc.localized = 0;
      doc.save();
    });
  })
  setTimeout(function () {res.send(data);}, 500);
});

router.post('/remove', (req, res) => {
  var data = {
    ok: true
  }
  models.marker.find({author: req.body.id}, function (err, docs) {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.remove();
    });
  })
  models.driverStats.find({owner: req.body.id}, function (err, docs) {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.remove();
    });
  })
  models.userStats.find({owner: req.body.id}, function (err, docs) {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.remove();
    });
  })
  models.notify.find({owner: req.body.id}, function (err, docs) {
    if (err) {
      data.ok = false;
      return;
    }
    docs.forEach(doc => {
      doc.remove();
    });
  })
  models.user.findById(req.body.id, function (err, doc) {
    if (err) {
      data.ok = false;
      return;
    }
    doc.remove();
  })
  setTimeout(function () {res.send(data);}, 500);
});
  
module.exports = router;