const express = require('express');

const userRoute = require('./User');
const linkingRoute = require('./Linking');
const depositRoute = require('./Deposit');
const assetRoute = require('./Asset');
const { httpMiddleware } = require('../helper/middleware');

const router = express.Router();

router.use('/', httpMiddleware);

router.use('/user', userRoute);

router.use('/linking', linkingRoute);

router.use('/deposit', depositRoute);

router.use('/asset', assetRoute);

module.exports = router;
