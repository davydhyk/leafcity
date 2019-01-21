const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      path = require('path'),
      mongoose = require('mongoose'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session);

const config = require('./config'),
      routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.set('debug', config.DEV);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('database closed connection'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    app.listen(config.PORT, () => console.log('App listening port ' + config.PORT));
  });
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', routes.auth);

app.get('/reg', (req, res) => {
  if (req.session.user_id) res.redirect('/');
  else res.render('reg');
});

app.get('/', (req, res) => {
  console.log(req.session.user_id);
  res.render('index');
  console.log(req.session.user_role);
});