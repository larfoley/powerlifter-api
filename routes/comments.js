const router = require('express').Router();
const CommentModel = require('../models/Comment');

router.get('/', async (req, res, next) => {
  try {
    const comments = await CommentModel.find({});

    res.status(200).json({ comments })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const comment = await CommentModel.findById(id);

    res.status(200).json({ comment })

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const comment = new CommentModel(req.body.comment);

  try {
    await comment.save();

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

module.exports = router;
