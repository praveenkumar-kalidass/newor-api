const passwordHash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { getAppConfig } = require('../../config');
const userDao = require('../dao/User');
const neworError = require('../constant/error');
const constant = require('../constant');
const mailer = require('../helper/mailer');
const template = require('../helper/template');

const config = getAppConfig();

const signup = async (user) => {
  try {
    console.log('Initiating signup user.');
    const id = uuidv4();
    const verificationToken = jwt.sign({ id }, config.emailVerificationTokenSecret);
    const result = await userDao.save({
      ...user,
      id,
      password: passwordHash.generate(user.password),
    });
    console.log('Initiating verification mail to user.');
    await mailer.sendMail({
      from: config.emailId,
      to: result.email,
      subject: constant.VERIFICATION_MAIL.SUBJECT,
      html: template.getVerificationMail({
        baseURL: config.baseURL,
        link: `/api/linking/v1/email-verification/${verificationToken}`,
      }),
    });
    console.log('Successfully sent verification mail to user.');
    console.log('Successfully signed up user.');
    return result;
  } catch (error) {
    console.error('Error while signing up user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const login = async (user) => {
  try {
    console.log('Initiating login user.');
    const result = await userDao.fetch({ email: user.email });
    if (!result) {
      console.log('No user found with email: ', user.email);
      throw neworError.USER_NOT_FOUND;
    }
    if (!result.isVerified) {
      console.log('Unverified user with email: .', user.email);
      throw neworError.EMAIL_NOT_VERIFIED;
    }
    if (passwordHash.verify(user.password, result.password)) {
      console.log('Successfully verified user credentials.');
      delete result.password;
      return result;
    }
    console.log('User credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    console.error('Error while login user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const verify = async (token) => {
  try {
    console.log('Initiating user verification.');
    const tokenVerified = jwt.verify(token, config.emailVerificationTokenSecret);
    if (tokenVerified) {
      const { id } = jwt.decode(token, config.emailVerificationTokenSecret);
      const user = await userDao.fetch({ id });
      if (!user) {
        console.log('No user found with id from token: ', token);
        throw neworError.USER_NOT_FOUND;
      }
      const result = await userDao.update({ id }, { isVerified: true });
      console.log('Successfully completed user verification.');
      return result;
    }
    console.log('Token verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    console.error('Error while verifying user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const forgotPassword = async (email) => {
  try {
    console.log('Initiating forgot password request.');
    const result = await userDao.fetch({ email });
    if (!result) {
      console.log('No user found with email: ', email);
      throw neworError.USER_NOT_FOUND;
    }
    if (!result.isVerified) {
      console.log('Unverified user with email: .', email);
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
    console.log('Successfully sent password reset mail to user.');
    console.log('Successfully requested password reset for user.');
    return { email: result.email };
  } catch (error) {
    console.error('Error while doing forgot password for user. Error: ', error);
    if (neworError.isNeworError(error)) {
      throw error;
    }
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const resetPassword = async (data) => {
  try {
    console.log('Initiating reset password request.');
    const tokenVerified = jwt.verify(data.token, config.passwordResetTokenSecret);
    if (tokenVerified) {
      const { id } = jwt.decode(data.token, config.passwordResetTokenSecret);
      const result = await userDao.update({ id }, {
        password: passwordHash.generate(data.password),
      });
      console.log('Successfully completed user password reset.');
      return { email: result.email };
    }
    console.log('Token verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    console.error('Error while resetting password for user. Error: ', error);
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
