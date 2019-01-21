const router = require('express').Router();
const models = require('../models');
const emailValid = require("email-validator");
const bcrypt = require('bcrypt-nodejs');

router.post('/reg', (req, res) => {
  var phone = req.body.phone,
      email = req.body.email,
      password = req.body.password,
      rep_password = req.body.rep_password,
      data = {
        ok: true,
        msg: '',
        fields: []
      };
  if (!phone || !email || !password || !rep_password) {
    data.ok = false;
    if (!phone) data.fields.push('phone');
    if (!email) data.fields.push('email');
    if (!password) data.fields.push('password');
    if (!rep_password) data.fields.push('rep_password');
    data.msg = 'Заповніть всі поля';
  } else if (!emailValid.validate(email)) {
    data.fields.push('email');
    data.ok = false;
    data.msg = 'Введіть вірний email'
  } else if (phone.length < 19) {
    data.fields.push('phone');
    data.ok = false;
    data.msg = 'Введіть вірний телефон'
  } else if (password.length < 6) {
    data.fields.push('password');
    data.ok = false;
    data.msg = 'Довжина пароля не менше 6 символів'
  } else if (password != rep_password) {
    data.fields.push('password');
    data.fields.push('rep_password');
    data.ok = false;
    data.msg = 'Паролі не співпадають'
  }
  if (!data.ok) {res.send(data); return;}
  models.user.findOne({'email': email}, (err, user) => {
    if (err) data.ok = false;
    if (user) data.ok = false;
    if (err) data.msg = 'Помилка. Спробуйте пізніше...';
    else if (user) data.msg = 'Вказаний email зайнятий';
    if (!data.ok) {res.send(data); return;}
    models.user.findOne({'phone': phone.replace(/ |\(|\)|-/g, '')}, (err, user) => {
      if (err) data.ok = false;
      if (user) data.ok = false;
      if (err) data.msg = 'Помилка. Спробуйте пізніше...';
      else if (user) data.msg = 'Вказаний телефон зайнятий';
      if (!data.ok) {res.send(data); return;}
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          data.ok = false;
          data.msg = 'Помилка. Спробуйте пізніше...';
          res.send(data);
          return;
        }
        models.user.create({
          email: email,
          phone: phone.replace(/ |\(|\)|-/g, ''),
          password: hash
        }).then(user => {
          res.send(data);
        }).catch((err) => {
          data.ok = false;
          data.msg = 'Помилка. Спробуйте пізніше...';
          res.send(data);
        });
      });
    });
  })
});

module.exports = router;