const router = require('express').Router();
const PostModel = require('../models/Exercise');

router.post('/', async (req, res, next) => {
  try {
    const post = new PostModel(req.body.post);
  
    await post.save();

    return res.json({ post });

  } catch(error) {
    next(error);
  }
});

module.exports = router;