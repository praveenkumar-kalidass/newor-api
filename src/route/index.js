const express = require('express');

const userRoute = require('./User');
const router = express.Router();

router.use('/user', userRoute);

module.exports = router;
