const router = require('express').Router();
const UserModel = require('../models/User');
const NotificationModel = require('../models/Notification');

//Get all friend requests
router.get('/', async (req, res, next) => {
  const { user } = req;

  try {
    const friends = await UserModel.getFriends(user)

    const friendRequests = friends
      .filter(fr => fr.status != 'accepted')
      .map(fr => {
        const { status } = fr;

        fr.friend.requestSent = status === 'pending';
        fr.friend.friendRequestSent = status === 'requested';
        return fr
      });

    res.status(200).json({ friendRequests });

  } catch(error) {
    next(error);
  }
});

// Create a friend request
router.post('/', async (req, res, next) => {
  const friendId = req.body.friendRequest.friend;

  try {
    const friendRequest = await UserModel.requestFriend(req.user, req.body.friendRequest.friend);
    const friend = await UserModel.findById(friendId);
    const { added, status, _id } = friendRequest.friender;
    const currentUser = await UserModel.findById(req.user.id)

    const response = {
      friendRequest: {
        _id,
        added,
        status,
        friend
      }
    }

    const notification = new NotificationModel({
      for: friendId,
      from: req.user.username,
      text: `sent you a friend request`,
      link: {
        route: 'my-network.friend-requests',
      }
    })

    await notification.save();

    const fr =  {
      friendRequest: {
        ...friendRequest.friend,
        friend: currentUser,
      }
    }

    delete fr.friendRequest.data;

    res.io.emit(`notification/${friendId}`, { notification });
    res.io.emit(`friend-request-recieved/${friendId}`, fr);

    res.status(200).json(response);

  } catch(error) {
    next(error);
  }
});

// Confirm Request
router.put('/:friend_id', async (req, res, next) => {

  try {
    const friend = await UserModel.findById(req.params.friend_id);
    const friendRequest = await UserModel.requestFriend(req.user, friend);
    const { _id, added, status } = friendRequest.friender;
    const currentUser = await UserModel.findById(req.user.id)

    const response = {
      friendRequest: {
        _id,
        added,
        status,
        friend
      }
    }

    const fr =  {
      friendRequest: {
        ...friendRequest.friend,
        friend: currentUser,
      }
    }

    res.io.emit(`friend-request-accepted/${req.params.friend_id}`, fr);

    res.status(200).json(response);

  } catch(error) {
    next(error);
  }
});

router.get('/:friend_id', async (req, res, next) => {

  try {
    let friends = await UserModel.getFriends(req.user);

    friendRequest = friends.find(f => f._id == req.params.friend_id);

    res.status(200).json({ friendRequest });

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
