const passwordHash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { appConfig: config } = require('../../config');
const userDao = require('../dao/User');
const neworError = require('../constant/error');
const constant = require('../constant');
const mailer = require('../helper/mailer');
const template = require('../helper/template');
const logger = require('../helper/logger');

const signup = async (ctxt, user) => {
  const log = await logger.init(ctxt, null, {
    class: 'user_service',
    method: 'signup',
  });
  try {
    log.info('Initiating signup user.');
    const id = uuidv4();
    const verificationToken = jwt.sign({ id }, config.emailVerificationTokenSecret);
    const result = await userDao.save(ctxt, {
      ...user,
      id,
      password: passwordHash.generate(user.password),
    });
    log.info('Initiating verification mail to user.');
    await mailer.sendMail({
      from: config.emailId,
      to: result.email,
      subject: constant.VERIFICATION_MAIL.SUBJECT,
      html: template.getVerificationMail({
        baseURL: config.baseURL,
        link: `/api/linking/v1/email-verification/${verificationToken}`,
      }),
    });
    log.info('Successfully sent verification mail to user.');
    log.info('Successfully signed up user.');
    return result;
  } catch (error) {
    log.error(`Error while signing up user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const login = async (ctxt, user) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'user_service',
    method: 'login',
  });
  try {
    log.info('Initiating login user.');
    const result = await userDao.fetch(log.context, { email: user.email });
    if (!result) {
      log.info(`No user found with email: ${user.email}`);
      throw neworError.USER_NOT_FOUND;
    }
    if (!result.isVerified) {
      log.info(`Unverified user with email: ${user.email}`);
      throw neworError.EMAIL_NOT_VERIFIED;
    }
    if (passwordHash.verify(user.password, result.password)) {
      log.info('Successfully verified user credentials.');
      delete result.password;
      return result;
    }
    log.info('User credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error('Error while login user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

const verify = async (ctxt, token) => {
  const log = await logger.init(ctxt, null, {
    class: 'user_service',
    method: 'login',
  });
  try {
    log.info('Initiating user verification.');
    const tokenVerified = jwt.verify(token, config.emailVerificationTokenSecret);
    if (tokenVerified) {
      const { id } = jwt.decode(token, config.emailVerificationTokenSecret);
      const user = await userDao.fetch(ctxt, { id });
      if (!user) {
        log.info(`No user found with id from token: ${token}`);
        throw neworError.USER_NOT_FOUND;
      }
      const result = await userDao.update(ctxt, { id }, { isVerified: true });
      log.info('Successfully completed user verification.');
      return result;
    }
    log.info('Token verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error(`Error while verifying user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const forgotPassword = async (ctxt, email) => {
  const log = await logger.init(ctxt, null, {
    class: 'user_service',
    method: 'forgotPassword',
  });
  try {
    log.info('Initiating forgot password request.');
    const result = await userDao.fetch(ctxt, { email });
    if (!result) {
      log.info(`No user found with email: ${email}`);
      throw neworError.USER_NOT_FOUND;
    }
    if (!result.isVerified) {
      log.info(`Unverified user with email: ${email}`);
      throw neworError.EMAIL_NOT_VERIFIED;
    }
    const resetToken = jwt.sign({ id: result.id }, config.passwordResetTokenSecret);
    await mailer.sendMail({
      from: config.emailId,
      to: result.email,
      subject: constant.VERIFICATION_MAIL.PASSWORD_RESET,
      html: template.getPasswordResetMail({
        baseURL: config.baseURL,
        link: `/api/linking/v1/reset-password/${resetToken}`,
      }),
    });
    log.info('Successfully sent password reset mail to user.');
    log.info('Successfully requested password reset for user.');
    return { email: result.email };
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error(`Error while doing forgot password for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const resetPassword = async (ctxt, data) => {
  const log = await logger.init(ctxt, null, {
    class: 'user_service',
    method: 'resetPassword',
  });
  try {
    log.info('Initiating reset password request.');
    const tokenVerified = jwt.verify(data.token, config.passwordResetTokenSecret);
    if (tokenVerified) {
      const { id } = jwt.decode(data.token, config.passwordResetTokenSecret);
      const result = await userDao.update(ctxt, { id }, {
        password: passwordHash.generate(data.password),
      });
      log.info('Successfully completed user password reset.');
      return result;
    }
    log.info('Token verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error(`Error while resetting password for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
  login,
  verify,
  forgotPassword,
  resetPassword,
};
