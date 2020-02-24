require('dotenv').config();
require('./passport')
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport = require('passport');
const cors = require('cors');
const createError = require('http-errors');

// Routes
const usersRouter = require('./routes/users');
const goalsRouter = require('./routes/goals');
const authRouter = require('./routes/auth');
const friendRequestsRouter = require('./routes/friend-requests');
const liftRecordsRouter = require('./routes/lift-records');
const exercisesRouter = require('./routes/exercises');
const notificationsRouter = require('./routes/notifications');

mongoose.Promise = global.Promise;

const app = express();
const db = mongoose.connection;
const protected = passport.authenticate('jwt', { session: false });



// Connect to db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', console.error.bind(console, 'Error connecting to the database'));
db.once('open', () => { console.log('Connected to database'); });

// Middleware
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

//Route handlers
app.use(authRouter);
app.use('/users', protected, usersRouter);
app.use('/goals', protected, goalsRouter);
app.use('/friendRequests', protected, friendRequestsRouter);
app.use('/liftRecords', protected, liftRecordsRouter);
app.use('/exercises', protected, exercisesRouter);
app.use('/notifications', notificationsRouter);

// Error handlers
app.use(function(req, res, next) {
  next(createError(404))
});


app.use(function(err, req, res, next) {
  const status = err.status || 500;
  const error = req.app.get('env') === 'development' ? err : {};

  if (error.name === 'ValidationError') {

    const errors = [];

    for (key in error.errors) {
      errors.push({
        status,
        source: { pointer: `"/data/attributes/${key}` },
        detail: error.errors[key].message
      })
    }

    res.status(422).json({ errors });

  } else {
    res.status(status).json({
      errors: [
        {
          status,
          source: { pointer: "" },
          detail: error.message
        }
      ]
    });
  }
});

module.exports = app;
