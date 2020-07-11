const router = require('express').Router();
const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post');

router.get('/', getPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
