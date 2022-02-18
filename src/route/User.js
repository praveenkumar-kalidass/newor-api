const express = require('express');

const userController = require('../controller/User');
const router = express.Router();

router.post('/v1/signup', userController.signupV1);

module.exports = router;
