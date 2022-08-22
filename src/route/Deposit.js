const express = require('express');

const depositController = require('../controller/Deposit');
const { requestResponseMiddleware, authMiddleware } = require('../helper/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/deposit/v1:
 *  post:
 *    summary: Save Deposit
 *    description: Save new deposit details for asset
 *    tags:
 *      - Deposit
 *    security:
 *      - bearerAuth: []
 *      - idAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              interestRate:
 *                type: number
 *                format: float
 *              initial:
 *                type: number
 *                format: float
 *              value:
 *                type: number
 *                format: float
 *              depositoryName:
 *                type: string
 *              startedAt:
 *                type: string
 *                format: date
 *              maturityAt:
 *                type: string
 *                format: date
 *              assetId:
 *                type: string
 *                format: uuid
 *            required:
 *              - type
 *              - interestRate
 *              - initial
 *              - value
 *              - depositoryName
 *              - startedAt
 *              - maturityAt
 *              - assetId
 *    responses:
 *      200:
 *        description: Save Deposit success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.post('/v1', requestResponseMiddleware, authMiddleware, depositController.postV1);

module.exports = router;
