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

/**
 * @swagger
 * /api/user/v1/login:
 *  post:
 *    summary: User login
 *    description: User login V1
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              clientId:
 *                type: string
 *                format: uuid
 *              clientSecret:
 *                type: string
 *              grantType:
 *                type: string
 *                default: password
 *              responseType:
 *                type: string
 *                default: code
 *            required:
 *              - email
 *              - password
 *              - clientId
 *              - clientSecret
 *              - grantType
 *              - responseType
 *    responses:
 *      200:
 *        description: Login success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.use('/v1/login', (request, response, next) => {
  request.body.client_id = request.body.clientId;
  delete request.body.clientId;
  request.body.client_secret = request.body.clientSecret;
  delete request.body.clientSecret;
  request.body.grant_type = request.body.grantType;
  delete request.body.grantType;
  request.body.response_type = request.body.responseType;
  delete request.body.responseType;
  next();
});
router.post('/v1/login', userController.loginV1);

module.exports = router;
