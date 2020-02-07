const router = require('express').Router();
const passport = require('passport');
const UserService = require('../services/User');
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
  function(req, res, next) {
    
    const token = new UserService().signToken(req.user);
    
    res.status(200).json({
      access_token: token,
      token_type: "bearer"
    });
  }
);

module.exports = router;
