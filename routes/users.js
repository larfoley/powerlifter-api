const router = require('express').Router();
const createError = require('http-errors');
const UserModel = require('../models/User');
const s3 = require('../services/s3')

router.get('/me', async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate('workoutHistory');
  
  res.status(200).json({ user });
});

router.get('/', async (req, res, next) => {
  const searchTerm = req.query.search;
  const currentUserId = req.user && req.user.id;
  const friendShipRequested = req.query.friendShipRequested;

  try {
    const currentUserFriends = await UserModel.getFriends(req.user);

    const query = {
      _id: { $ne: req.user._id }
    }

    if (searchTerm) {
      query.username = { $regex: `.*${searchTerm.trim().split(' ').join('')}.*`, $options: 'i', }
    }

    let users = await UserModel.find(query)
      .select('-password')
      .lean()
      .populate('workoutHistory');

    for (const user of users) {
      UserModel.addFriendshipMetaData(currentUserFriends, user);
    }

    res.status(200).json({ users });

  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('workoutHistory');

    if (!user) {
      return next(createError(404));
    }

    res.json({ user })

  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const update = {};

  if (req.body.user.profilePic) {
    update.profilePic = req.body.user.profilePic
  }

  if (req.body.user.coverPhoto) {
    update.coverPhoto = req.body.user.coverPhoto
  }

  try {
    const user = await UserModel.findById(req.user.id).populate('workoutHistory');
    const oldProfilePic = user.profilePic;
    const newProfilePic = req.body.user.profilePic;
    const oldCoverPhoto = user.coverPhoto;
    const newCoverPhoto = req.body.user.coverPhoto;

    if (oldProfilePic != newProfilePic && newProfilePic.trim() != "") {

      const data = await s3.deleteObject({
        Key: oldProfilePic
      });

      await UserModel.findByIdAndUpdate(req.params.id, update);
    }

    if (oldCoverPhoto != newCoverPhoto && newCoverPhoto.trim() != "") {

      const data = await s3.deleteObject({
        Key: oldCoverPhoto
      });

      await UserModel.findByIdAndUpdate(req.params.id, update);
    }

    const updatedUser = await UserModel.findById(req.user.id).populate('workoutHistory')

    res.json({ user: updatedUser })

  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.user._id);

    res.status(200).json({ });

  } catch (error) {
    next(error);
  }
});

router.post('/:id/request-friend', async (req, res, next) => {
  const currentUserId = '5d8fc17c0ea3b62d1811520d';
  const friendRequestId = '5d8fc1420ea3b62d1811520c';

  try {
    const response = await userService.sendFreindRequest(currentUserId, friendRequestId);

    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
