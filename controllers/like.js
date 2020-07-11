const PostModel = require('../models/Post');
const LikeModel = require('../models/Like');
const NotificationModel = require('../models/Notification');
const UserModel = require('../models/User');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports = {

  async createLike(req, res, next) {
    const like = new LikeModel(req.body.like);

    try {
      const existingLike = await LikeModel.findOne(req.body.like);

      if (existingLike) {
        return next(createError(409));
      };

      await like.save();

      const post = await PostModel.findById(like.post);

      post.likesCount += 1;
      post.likes.push(like);

      if (post.likes.length > 10) {
        post.likes.pop();
      }

      await post.save();

      if (req.user.username !== post.author.username) {
        const postAuthor = await UserModel.findOne({ username: post.author.username });

        const notification = new NotificationModel({
          for: [postAuthor._id],
          from: req.user.username,
          text: `liked a post`,
          link: {
            route: 'posts.post',
            model: post.id
          }
        })

        await notification.save();

        res.io.emit(`notification/${postAuthor._id}`, notification);
      }

      res.status(200).json({ like })

    } catch(error) {
      next(error);
    }
  },

  async getLikes(req, res, next) {
    const likeIds = req.query.ids || [];
    const query = {};

    if (likeIds.length > 0) {
      query['_id'] = { $in: likeIds };
    }

    try {
      const like = await LikeModel.find(query);

      res.status(200).json({ like });

    } catch(error) {
      next(error)
    }
  },

  async getLike(req, res, next) {
    try {
      const like = await LikeModel.findById(req.params.id);

      res.status(200).json({ like });

    } catch(error) {
      next(error)
    }
  },

  async deleteLike(req, res, next) {
    try {
      const like = await LikeModel.findById(req.params.id);
      const likedPost = await PostModel.findById(like.post);

      likedPost.likesCount -= 1;
      likedPost.likes.pull(like._id);

      await likedPost.save();
      await like.remove();

      res.status(200).json({});

    } catch(error) {
      next(error)
    }
  }

};
