const router = require('express').Router();
const CommentModel = require('../models/Comment');
const PostModel = require('../models/Post');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', async (req, res, next) => {
  const commentIds = req.query.ids ? req.query.ids.map(id => ObjectId(id)) : [];
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  const postId = req.query.postId ? ObjectId(req.query.postId) : null;

  try {
    let comments;

    if (commentIds.length) {
      comments = await CommentModel
        .where('_id')
        .in(commentIds)
        .limit(limit)
        .lean();

    } else if (ObjectId.isValid(postId)) {
      comments = await CommentModel
        .where('post')
        .eq(postId)
        .skip(offset)
        .limit(limit)
        .lean();
    }

    comments.map(c => {
      if (c.author.username === req.user.username) {
        c.isCurrentUsersComment = true;
        return c;
      }
      return c;
    })

    res.status(200).json({ comments, meta: { offset } })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const comment = await CommentModel.findById(id).lean();

    if (comment.author.username === req.user.username) {
      comment.isCurrentUsersComment = true;
    }

    res.status(200).json({ comment })

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const comment = new CommentModel(req.body.comment);

  try {
    await comment.save();

    const post = await PostModel.findById(comment.post);

    post.comments.push(comment._id);
    post.commentsCount = post.commentsCount + 1;

    await post.save();

    res.status(200).json({ comment })

  } catch(error) {
    next(error)
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const update = req.body.comment;

  try {
    const comment = await CommentModel.findOneAndUpdate(id, update);
    res.status(200).json({ comment })

  } catch(error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const comment = await CommentModel.findById(id);
    const post = await PostModel.findById(comment.post);

    post.comments.pull(comment._id);
    await post.save();

    res.status(200).json({})

  } catch(error) {
    next(error)
  }
});


module.exports = router;
