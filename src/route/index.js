const express = require('express');

const userRoute = require('./User');
const linkingRoute = require('./Linking');

const router = express.Router();

router.use('/user', userRoute);

router.use('/linking', linkingRoute);

module.exports = router;
