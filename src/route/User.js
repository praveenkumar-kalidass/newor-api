const express = require('express');

const userController = require('../controller/User');
const router = express.Router();

/**
 * @swagger
 * /api/user/v1/signup:
 *  post:
 *    summary: User signup
 *    description: User Signup V1
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Signup success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.post('/v1/signup', userController.signupV1);

module.exports = router;
