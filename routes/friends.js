const router = require('express').Router();
const createError = require('http-errors');
const UserModel = require('../models/User');

router.get('/', async (req, res, next) => {

  try {
    let friends = await UserModel.getAcceptedFriends(req.user);

    friends = friends.map(({ friend }) => UserModel.addFriendshipMetaData(friends, friend));

    res.status(200).json({ friends });

  } catch (error) {
    next(error);
  }
});

router.delete('/:friend_id', async (req, res, next) => {

  try {
    const friend = await UserModel.findById(req.params.friend_id);
    await UserModel.removeFriend(req.user, friend);

    res.status(200).json({});

  } catch (error) {
    next(error);
  }
});



module.exports = router;
