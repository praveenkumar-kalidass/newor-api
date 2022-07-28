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
      verificationToken,
      password: passwordHash.generate(user.password),
    });
    console.log('Initiating verification mail to user.');
    await mailer.sendMail({
      from: config.emailId,
      to: result.email,
      subject: constant.VERIFICATION_MAIL.SUBJECT,
      html: template.getVerificationMail({
        baseURL: config.baseURL,
        link: `/api/user/v1/verify/${verificationToken}`,
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
    const tokenVerified = jwt.verify(token, config.emailVerificationTokenSecret);
    if (tokenVerified) {
      const { id } = jwt.decode(token, config.emailVerificationTokenSecret);
      const result = await userDao.fetch({ id });
      if (!result) {
        console.log('No user found with id from token: ', token);
        throw neworError.USER_NOT_FOUND;
      }
      if (result.verificationToken === token) {
        await userDao.update({ id }, { isVerified: true });
        return template.getVerificationStatus({
          baseURL: config.baseURL,
          success: true,
        });
      }
    }
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    console.error('Error while verifying user. Error: ', error);
    return template.getVerificationStatus({
      baseURL: config.baseURL,
      success: false,
    });
  }
};

module.exports = {
  signup,
  login,
  verify,
};
