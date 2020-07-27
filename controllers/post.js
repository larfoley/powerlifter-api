const PostModel = require('../models/Post');
const UserModel = require('../models/User');
const CommentModel = require('../models/Comment');
const NotificationModel = require('../models/Notification');
const LikeModel = require('../models/Like');
const s3 = require('../services/s3');

const formatPostResponse = async (post, user) => {
  while (post.comments.length > 5) {
    post.comments.pop();
  }

  const like = await LikeModel.findOne({ post: post._id, user: user._id  });

  post.like = like ? like._id : null;
}

module.exports = {

  async updatePost(req, res, next) {
      try {
        const post = await PostModel.findByIdAndUpdate(req.params.id).populate('author').lean();

        await formatPostResponse(post, req.user);

        res.json({ post });

      } catch (error) {
        next(error)
      }
  },

  async createPost(req, res, next) {
    const post = new PostModel(req.body.post);

    try {
      await post.save();

      const friends = await UserModel.getAcceptedFriends(req.user);

      for (const friend of friends) {
        const notification = new NotificationModel({
          for: friend._id,
          from: req.user.username,
          text: `shared a post`,
          link: {
            route: 'posts.post',
            model: post._id
          }
        });

        await notification.save();

        res.io.emit(`notification/${friend._id}`, { notification });
        res.io.emit(`post/${friend._id}`, post);
      }

      const response = await PostModel.find({ _id: post._id }).populate('author');

      return res.json({ post: response });

    } catch(error) {
      next(error);
    }
  },

  async deletePost(req, res, next) {
    try {
      const post = await PostModel.findById(req.params.id);

      if (post.media) {
        await s3.deleteObject({
          Key: post.media.url
        });
      }

      await CommentModel.deleteMany({'_id': { $in: post.comments } });
      await LikeModel.deleteMany({'post': post._id });

      await post.remove();

      return res.json({});

    } catch(error) {
      next(error);
    }
  },

  async getPosts(req, res, next) {
    try {
      const friends = await UserModel.getAcceptedFriends(req.user);

      const postAuthors = friends.map(friend => friend.friend._id);

      postAuthors.push(req.user._id)

      const test = await PostModel.find({author: req.user._id})

      const posts = await PostModel
        .where("author")
        .in(postAuthors)
        .sort('-createdAt')
        .populate('author')
        .lean()

      for (post of posts) {
        await formatPostResponse(post, req.user);
      }

      res.json({ posts });

    } catch(error) {
      next(error);
    }
  }
}
