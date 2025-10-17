const express = require('express');
const router = express.Router();
const controller = require('../controllers/message.controller');
const { authorize } = require('../middleware/auth');

router.post('/', authorize(), controller.sendMessage);
router.get('/thread/:userId', authorize(), controller.getThreadWithUser);
router.get('/user/:userId', authorize(), controller.getUserMessages);

module.exports = router;
