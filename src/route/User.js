const express = require('express');

const userController = require('../controller/User');
const constant = require('../constant');

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
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              mobileNumber:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - firstName
 *              - lastName
 *              - mobileNumber
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

/**
 * @swagger
 * /api/user/v1/authorize:
 *  post:
 *    summary: Authenticate Refresh token
 *    description: Regenerate Access token using Refresh token
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              clientId:
 *                type: string
 *                format: uuid
 *              clientSecret:
 *                type: string
 *              grantType:
 *                default: refresh_token
 *              refreshToken:
 *                type: string
 *            required:
 *              - clientId
 *              - clientSecret
 *              - grantType
 *              - refreshToken
 *    responses:
 *      200:
 *        description: Authorization success
 *      401:
 *        description: Authorization failed
 */
router.use('/v1/authorize', (request, response, next) => {
  if (request.body.grantType === constant.AUTH_GRANT_TYPE.PASSWORD) {
    request.body.username = request.body.email;
    delete request.body.email;
    request.body.response_type = request.body.responseType;
    delete request.body.responseType;
  }
  if (request.body.grantType === constant.AUTH_GRANT_TYPE.REFRESH_TOKEN) {
    request.body.refresh_token = request.body.refreshToken;
    delete request.body.refreshToken;
  }
  request.body.client_id = request.body.clientId;
  delete request.body.clientId;
  request.body.client_secret = request.body.clientSecret;
  delete request.body.clientSecret;
  request.body.grant_type = request.body.grantType;
  delete request.body.grantType;
  next();
});
router.post('/v1/authorize', userController.authorizeV1);

/**
 * @swagger
 * /api/user/v1/verify/{token}:
 *  get:
 *    summary: Verify user email token
 *    description: Token verification sent throught email
 *    tags:
 *      - User
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Verification success
 *      500:
 *        description: Verification failed
 */
router.get('/v1/verify/:token', userController.verifyV1);

/**
 * @swagger
 * /api/user/v1/forgot-password:
 *  post:
 *    summary: Forgot password
 *    description: Forgot Password V1
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *            required:
 *              - email
 *    responses:
 *      200:
 *        description: Forgot password success
 *      500:
 *        description: Internal Server error
 *      400:
 *        description: Bad request
 */
router.post('/v1/forgot-password', userController.forgotPasswordV1);

module.exports = router;
