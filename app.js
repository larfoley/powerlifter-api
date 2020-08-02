require('dotenv').config();
require('./passport')
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const cors = require('cors');
const createError = require('http-errors');
const queryParser = require('express-query-int');
const http = require('http')
const User = require('./models/User');
const database = require('./database');

// Routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const friendRequestsRouter = require('./routes/friend-requests');
// const liftRecordsRouter = require('./routes/lift-records');
const notificationsRouter = require('./routes/notifications');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const friendsRouter = require('./routes/friends');
const likesRouter = require('./routes/likes');
const uploadRouter = require('./routes/upload');
const currentProgramRouter = require('./routes/current-program');
const workoutProgramsRouter = require('./routes/workout-programs');
const workoutProgramTemplatesRouter = require('./routes/workout-program-templates');

const {
  goalsRouter,
  exercisesRouter,
  liftRecordsRouter
} = require('./routers');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const jwtAuth = require('socketio-jwt-auth');

database.connect(app.get('env'));

app.use(cors());

const protectedRoute = passport.authenticate('jwt', { session: false });
// Middleware
app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(queryParser());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

io.use(jwtAuth.authenticate({
  secret: 'theowlsarenotwhattheyseem',
}, function(payload, done) {
  User.findOne({_id: payload.sub}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, 'user does not exist');
    }
    return done(null, user);
  });
}));


io.on('connection', function(socket) {
  socket.join('notification/' + socket.request.user.id);
  socket.join('post/' + socket.request.user.id);
});

app.use(function(req, res, next) {
  res.io = io;
  next()
})

//Route handlers
app.use(authRouter);
app.use('/users', protectedRoute, usersRouter);
app.use('/goals', protectedRoute, goalsRouter);
app.use('/friendRequests', protectedRoute, friendRequestsRouter);
app.use('/liftRecords', protectedRoute, liftRecordsRouter);
app.use('/exercises', protectedRoute, exercisesRouter);
app.use('/notifications',protectedRoute, notificationsRouter);
app.use('/posts', protectedRoute, postsRouter);
app.use('/comments', protectedRoute, commentsRouter);
app.use('/friends', protectedRoute, friendsRouter);
app.use('/likes', protectedRoute, likesRouter);
app.use('/upload', protectedRoute, uploadRouter);
app.use('/currentPrograms', protectedRoute, currentProgramRouter);
app.use('/workoutPrograms', protectedRoute, workoutProgramsRouter);
app.use('/workoutProgramTemplates', protectedRoute, workoutProgramTemplatesRouter);

// Error handlers
app.use(function(req, res, next) {
  next(createError(404))
});

app.use(function(req, res, next) {
  next(createError(404))
});

app.use(function(error, req, res, next) {
  let status = error.status || 500;

  const response = {
    errors: []
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {

    status = 422;

    for (key in error.errors) {
      response.errors.push({
        status,
        source: { pointer: `data/attributes/${key}` },
        detail: error.errors[key].message
      })
    }

  } else if (status == 422) {
    // Handle validation errors that are not asociated with any specific attribute
    response.errors.push({
      status,
      source: { pointer: `data` },
      detail: error.message
    })
  }

  if (req.app.get('env') === 'development') {
    console.error("Error", error);
  }

  res.status(status).json(response);
});

module.exports = { app, server };
