const express = require('express');

const loanController = require('../controller/Loan');
const { requestResponseMiddleware, authMiddleware } = require('../helper/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/loan/v1:
 *  post:
 *    summary: Save Loan
 *    description: Save new loan details for liability
 *    tags:
 *      - Loan
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
 *              principal:
 *                type: number
 *                format: float
 *              value:
 *                type: number
 *                format: float
 *              lenderName:
 *                type: string
 *              startedAt:
 *                type: string
 *                format: date
 *              closingAt:
 *                type: string
 *                format: date
 *              liabilityId:
 *                type: string
 *                format: uuid
 *            required:
 *              - type
 *              - interestRate
 *              - principal
 *              - value
 *              - lenderName
 *              - startedAt
 *              - liabilityId
 *    responses:
 *      200:
 *        description: Save Loan success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.post('/v1', requestResponseMiddleware, authMiddleware, loanController.postV1);

module.exports = router;
