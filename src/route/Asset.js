const express = require('express');

const assetController = require('../controller/Asset');
const { requestResponseMiddleware, authMiddleware } = require('../helper/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/asset/v1/{assetId}:
 *  get:
 *    summary: Get Asset details
 *    description: Get asset list and worth
 *    tags:
 *      - Asset
 *    security:
 *      - bearerAuth: []
 *      - idAuth: []
 *    parameters:
 *      - in: path
 *        name: assetId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Get Asset success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.get('/v1/:assetId', requestResponseMiddleware, authMiddleware, assetController.getV1);

module.exports = router;
