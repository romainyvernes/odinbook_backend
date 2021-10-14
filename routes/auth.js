const express = require('express');
const router = express.Router();
const authenticateLocally = require('../auth/authMiddleware').authenticateLocally;

// import controller
const authController = require('../controllers/authController');

// POST create new user
router.post('/register', authController.register);

// POST authenticate existing user
router.post('/login', authenticateLocally, authController.login);

// GET log out current user
router.get('/logout', authController.logout);

module.exports = router;
