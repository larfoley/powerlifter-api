require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const goalsRouter = require('./routes/goals');
const pubsRouter = require('./routes/pubs');
const passport = require('passport');
const cors = require('cors');
const User = require('./models/User');
const passportConfig = require('./passport');
const JWT = require('jsonwebtoken');

const app = express();
const db = mongoose.connection;
const User = require('./models/User');
console.log(process.env.DB);

mongoose.connect(process.env.DB, { useNewUrlParser: true });

db.on('error', console.error.bind(console, 'Error connecting to the database'));
db.once('open', () => {
  console.log('Connected to database');
});


// const sessionOptions = {
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({ mongooseConnection: db }),
//   resave: true,
//   saveUninitialized: true,
//   cookie: {},
// };
//
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1); // trust first proxy
//   sessionOptions.cookie.secure = true; // serve secure cookies
// }

app.use(helmet());
// app.use(session(sessionOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.post('/token', passport.authenticate('local', { session: false }), function(req, res) {
  // get username and password
  const user = req.user;
  

  // generae token
  const token = JWT.sign({
    iss: 'powerlifting-app', // Optional
    sub: user._id,
    iat: new Date().getTime(), // Optional
    exp: new Date().setDate(new Date().getDate() + 1), // Optional
  }, 'theowlsarenotwhattheyseem'); // Secret: should generate long randon string
  res.json({
    access_token: token
  })
});

// Protected routes
// app.use('/users',  passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/users', usersRouter);
app.use('/pubs', pubsRouter);
app.use(passport.authenticate('jwt', { session: false }));
app.use('/', indexRouter);
app.use('/goals', goalsRouter);

app.get('/current-user',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, email: req.user.emails[0].value });
  });





module.exports = app;
