const router = require('express').Router();
const UserModel = require('../models/User');

router.post('/', async (req, res, next) => {
  const friendRequest = req.body.friendRequest;
  const { from, to } = friendRequest;

  try {
    if (friendRequest.sendFriendRequest || friendRequest.acceptFriendRequest) {
      await UserModel.requestFriend(from, to);

    } else {
      await UserModel.removeFriend(from, to);
    }

    res.status(200).json({ friendRequest });

  } catch(error) {
    next(error);
  }
});


module.exports = router;
