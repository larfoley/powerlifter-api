const router = require('express').Router();
const PostModel = require('../models/Post');
const NotificationModel = require('../models/Notification');
const UserModel = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const friends = await UserModel.getFriends(req.user);

    const friendsUsernames = friends.map(friend => friend.friend.username);
    const posts = await PostModel.find({ "author.username": { $in: friendsUsernames }});

    res.json({ posts });

  } catch(error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const post = new PostModel(req.body.post);

  try {
    await post.save();

    const friends = await UserModel.getFriends(req.user);
    const notification = new NotificationModel({
      for: friends.map(friend => friend._id),
      text: `${req.user.username} shared a post`,
      link: `posts/${post.id}`
    })

    await notification.save();

    for (var friend of friends) {
      console.log('emitting event', `notification/${friend._id}`);
      console.log('emitting event', `post/${friend._id}`);
      res.io.emit(`notification/${friend._id}`, notification);
      res.io.emit(`post/${friend._id}`, post);
    }

    return res.json({ post });

  } catch(error) {
    next(error);
  }
});

module.exports = router;
