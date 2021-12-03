const express = require('express');
const router = express.Router();

// import controller
const userController = require('../controllers/userController');

// import authentication middleware that prevents a user from accessing other
// user's data
const isUser = require('../auth/authMiddleware').isUser;

// import image uploading middleware that attaches new image's URL to request
const upload = require('../utils/imageUpload');

// GET list of users matching query
router.get('/', userController.search);

// GET user's homepage with profile info, posts, and their respective comments
// or only user's account info if query specified
router.get('/:username', userController.index);

// PUT update user's account details
router.put('/:username', isUser, userController.update_account);

// DELETE delete user's account
router.delete('/:username', isUser, userController.delete_account);

// PUT update user's profile picture
router.put(
  '/:username/profile-picture', 
  isUser, 
  upload.single('image'), 
  userController.upload_picture
);

// GET list of user's friends
router.get('/:username/friends', userController.friends_list);

// POST add new friend (i.e., accept friend request)
router.post('/:username/friends', isUser, userController.friends_add);

// DELETE delete a friend
router.delete('/:username/friends/:friendId', isUser, userController.friends_delete);

// GET list of incoming friend requests for a given user
router.get('/:username/requests', isUser, userController.friend_requests_get);

// POST send a friend request
router.post('/:username/requests', isUser, userController.friend_request_create);

// DELETE decline a specific friend request
router.delete('/:username/requests/:friendId', isUser, userController.friend_request_delete);

module.exports = router;