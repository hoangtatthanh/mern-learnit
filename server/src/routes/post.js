const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');


const postController = require('../controllers/post.controller');

router.post('/', verifyToken, postController.create);
router.get('/', verifyToken, postController.index);
router.put('/:id', verifyToken, postController.update);
router.delete('/:id', verifyToken, postController.destroy);

module.exports = router;

