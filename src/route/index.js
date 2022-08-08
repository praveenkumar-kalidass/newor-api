const express = require('express');

const userRoute = require('./User');
const linkingRoute = require('./Linking');
const { httpMiddleware } = require('../helper/middleware');

const router = express.Router();

router.use('/', httpMiddleware);

router.use('/user', userRoute);

router.use('/linking', linkingRoute);

module.exports = router;
