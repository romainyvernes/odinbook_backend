const express = require('express');
const router = express.Router();

// import controller
const authController = require('../controllers/authController');

// POST create new user
router.post('/register', authController.register);

// POST authenticate existing user
router.post('/login', authController.login);

// GET log out current user
router.get('/logout', authController.logout);

module.exports = router;
