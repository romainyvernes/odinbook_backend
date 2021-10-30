const express = require('express');
const router = express.Router();

// import controller
const authController = require('../controllers/authController');

// import custom auth middleware that ensures user is authenticated
const isAuth = require('../auth/authMiddleware').isAuth;

// POST create new user
router.post('/register', authController.register);

// POST authenticate existing user
router.post('/login', authController.login);

// GET log out current user
router.get('/logout', authController.logout);

// GET check authentication
router.get('/verify', isAuth, authController.verify);

module.exports = router;
