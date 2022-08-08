const express = require('express');

const linkingController = require('../controller/Linking');
const { requestResponseMiddleware } = require('../helper/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/linking/v1/{path}/{token}:
 *  get:
 *    summary: Deeplinking url match
 *    description: Redirect to deeplinking url
 *    tags:
 *      - Linking
 *    parameters:
 *      - in: path
 *        name: path
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      307:
 *        description: Linking success
 *      500:
 *        description: Linking failed
 */
router.get('/v1/:path/:token', requestResponseMiddleware, linkingController.linkingV1);

module.exports = router;
