const router = require('express').Router();
const PostModel = require('../models/Exercise');
const NotificationModel = require('../models/Notification');

router.post('/', async (req, res, next) => {
  try {
    const post = new PostModel(req.body.post);

    await post.save();

    const friends = [];
    const notifications = [];

    for (var i = 0; i < friends.length; i++) {
      const notification = new NotificationModel({
        for: 1,
        title: "Posted an update"
        link: "/posts/"
      })

      notifications.push(notification.save());
    }

    await Promise.all(notifications);
    
    return res.json({ post });

  } catch(error) {
    next(error);
  }
});

module.exports = router;
