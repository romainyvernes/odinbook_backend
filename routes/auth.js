const express = require('express');
const router = express.Router();

// import controller
const authController = require('../controllers/authController');

/* GET log in page. */
router.get('/', function(req, res, next) {
  // send log in page
});

/*  */
router.post('/', authController.login);

module.exports = router;
