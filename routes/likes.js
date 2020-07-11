const router = require('express').Router();
const { getLikes, getLike, createLike, deleteLike } = require('../controllers/like');

router.get('/', getLikes);
router.get('/:id', getLike);
router.delete('/:id', deleteLike);
router.post('/', createLike);

module.exports = router;
