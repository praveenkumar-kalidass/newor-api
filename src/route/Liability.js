const express = require('express');

const liabilityController = require('../controller/Liability');
const { requestResponseMiddleware, authMiddleware } = require('../helper/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/liability/v1/{liabilityId}:
 *  get:
 *    summary: Get Liability details
 *    description: Get liability list and worth
 *    tags:
 *      - Liability
 *    security:
 *      - bearerAuth: []
 *      - idAuth: []
 *    parameters:
 *      - in: path
 *        name: liabilityId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Get Liability success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.get('/v1/:liabilityId', requestResponseMiddleware, authMiddleware, liabilityController.getV1);

module.exports = router;
