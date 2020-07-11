const router = require('express').Router();
const passport = require('passport');
const UserService = require('../services/User');
const UserModel = require('../models/User');
const createError = require('http-errors');

const userService = new UserService();

router.post('/sign-up', async (req, res, next) => {
  try {
    const existingUser = await userService.find(req.body.user);

    if (existingUser) {
      return next(createError(409, "User already exists"));
    }

    const newUser = await userService.create(req.body.user);

    res.status(200).json({ user: newUser });

  } catch (error) {
    next(error);
  }
});

router.post('/token',
  passport.authenticate('local', { session: false }),
  async function(req, res, next) {
    const token = new UserService().signToken(req.user);
    const user = await UserModel.findById(req.user._id);


    user.isOnline = true;

    await user.save()

    let friends = await UserModel.getAcceptedFriends(req.user);

    friends = friends.filter(friend => friend.friend.isOnline);

    for (var friend of friends) {
      res.io.emit(`friends/${friend._id}`, {
        friend: user
      });
    }

    res.status(200).json({
      access_token: token,
      token_type: "bearer"
    });
  }
);

router.post('/sign-out', async function(req, res, next) {
  const username = req.body.username;

  try {
    const user = await UserModel.findOne({ username: username });
    user.isOnline = false;

    await user.save()

    let friends = await UserModel.getAcceptedFriends(user);

    friends = friends.filter(friend => friend.friend.isOnline);

    req.logout();

    for (var friend of friends) {
      res.io.emit(`friends/${friend._id}`, {
        friend: user
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    next(error)
  }

  }
);

module.exports = router;
