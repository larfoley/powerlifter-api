const router = require('express').Router();
const UserService = require('../services/User');
const createError = require('http-errors');
const User = require('../models/User');

const userService = new UserService();

router.get('/me', function(req, res) {
  const user = req.user;

  res.status(200).json({ user });
});

router.get('/', async (req, res, next) => {
  const searchTerm = req.query.search;
  const currentUserId = req.user && req.user.id;
  
  try {
    const currenUserFriends = await User.getFriends(req.user);
    const query = {
      _id: { $ne: currentUserId }
    }

    if (searchTerm) {
      query.username = { $regex: `.*${searchTerm}.*` }
    }

    let users = await User
      .find(query)
      .select('-password')
      .lean()
      .exec()
    
    for (const user of users) {
      user.isFriend = false;
      user.friendRequestRecieved = false;
      user.friendRequestSent = false;

      currenUserFriends.forEach(friend => {
        
        if (friend._id.equals(user._id)) {
          if (friend.status === 'requested') {
            user.friendRequestSent = true;

          } else if (friend.status === 'pending') {
            user.friendRequestRecieved = true;

          } else if (friend.status === 'accepted') {
            user.isFriend = true;

          }
        }
      })
    }

    if (req.query.friendRequest) {      
      users = users.filter(user => user.friendRequestSent || user.friendRequestRecieved)
    } else if (req.query.isFriend) {
      users = users.filter(user => user.isFriend)
    }


    res.status(200).json({ users });

  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.find(req.params.id);

    if (!user) {
      return next(createError(404));
    }

    res.json({ user })

  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await userService.delete(req.params.id);

    res.status(200).json({ user });

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
