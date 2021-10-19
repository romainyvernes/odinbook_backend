const express = require('express');
const router = express.Router();

// import controllers
const userController = require('../controllers/userController');

// GET user's homepage with profile info, posts, and their respective comments
router.get('/:userId', userController.index);

// PUT update user's account details
router.put('/:userId', userController.update_account);

// DELETE delete user's account
router.delete('/:userId', userController.delete_account);

// GET list of user's friends
router.get('/:userId/friends', userController.friends_list);

// POST add new friend (i.e., accept friend request)
router.post('/:userId/friends', userController.friends_add);

// DELETE delete a friend
router.delete('/:userId/friends/:friendId', userController.friends_delete);

// GET list of incoming friend requests for a given user
router.get('/:userId/requests', userController.friend_requests_get);

// POST send a friend request
router.post('/:userId/requests', userController.friend_request_create);

// DELETE decline a specific friend request
router.delete('/:userId/requests/:friendId', userController.friend_request_delete);

module.exports = router;