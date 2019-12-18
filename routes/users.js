const router = require('express').Router();
const UserService = require('../services/User');
// const socketApi = require('../socketApi');

const userService = new UserService();


router.get('/me', function(req, res) {
  const user = req.user;
  user.id = user._id;

  res.json({user});
});

router.get('/', async (req, res, next) => {

  try {
    const users = await userService.findAll();

    res.json({ users }) && next();

  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.find(req.params.id);

    if (!user) {
      res.status(404);
    }

    res.json({ user }) && next();

  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await userService.delete(req.params.id);

    res.json({ user }) && next();

  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  return res.status(422).json({
    "errors": [
      {
        "detail": "not an email",
        "source": {
          "pointer": "data/attributes/email"
        }
      }
    ]
  });
  try {
    const user = await userService.create(req.body);
    res.json({ user }) && next();
    // const socketId = 1;
    // io.to(`${socketId}`).emit('hey', 'I just met you');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json(error);
    }

    next(error);
  }
});

router.post('/:id/request-friend', async (req, res, next) => {
  const currentUserId = '5d8fc17c0ea3b62d1811520d';
  const friendRequestId = '5d8fc1420ea3b62d1811520c';

  try {
    const response = await userService.sendFreindRequest(currentUserId, friendRequestId);

    res.json(response) && next();
    next();

  } catch (error) {
    next(error);
  }
});




module.exports = router;
