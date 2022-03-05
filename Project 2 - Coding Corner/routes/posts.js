var express = require('express');
var router = express.Router();
var postsCtrl = require('../controllers/posts.controller')

router.get('/', postsCtrl.index);
router.get('/all', postsCtrl.allPosts);
router.get('/new', postsCtrl.newPost);
router.get('/favourites', postsCtrl.showFavourites);
router.get('/:id', postsCtrl.show);
router.get('/:id/edit', postsCtrl.edit);

router.post('/', postsCtrl.create);
router.post('/:id/comments', postsCtrl.createComment);

router.put('/:id', postsCtrl.update);

router.delete('/:id', postsCtrl.deletePost);


module.exports = router;
