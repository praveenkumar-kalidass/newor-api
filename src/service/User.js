const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const { appConfig: config } = require('../../config');
const userDao = require('../dao/User');
const assetDao = require('../dao/Asset');
const liabilityDao = require('../dao/Liability');
const neworError = require('../constant/error');
const constant = require('../constant');
const aws = require('../helper/aws');
const template = require('../helper/template');
const logger = require('../helper/logger');
const { getImageUri } = require('../helper/util');

const signup = async (ctxt, user) => {
  const log = logger.init(ctxt, null, {
    class: 'user_service',
    method: 'signup',
  });
  try {
    log.info('Initiating signup user.');
    const result = await userDao.save(ctxt, {
      ...user,
      password: passwordHash.generate(user.password),
    });
    await Promise.all([
      assetDao.init(ctxt, { userId: result.id }),
      liabilityDao.init(ctxt, { userId: result.id }),
    ]);
    log.info('Initiating verification mail to user.');
    const verificationToken = jwt.sign({ id: result.id }, config.emailVerificationTokenSecret);
    await aws.sendMail({
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
  const log = logger.init(ctxt, null, {
    class: 'user_service',
    method: 'login',
  });
  try {
    log.info('Initiating login user.');
    const result = await userDao.fetch(ctxt, { email: user.email });
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
      let picture = '';
      if (result.picture) {
        const { Body: body } = await aws.getFile({
          bucket: config.userPictureBucket,
          key: result.picture,
        });
        picture = getImageUri(body, result.picture);
      }
      return {
        ...result,
        picture,
        idToken: jwt.sign(result, config.idTokenSecret),
      };
    }
    log.info('User credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error('Error while login user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const verify = async (ctxt, token) => {
  const log = logger.init(ctxt, null, {
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
  const log = logger.init(ctxt, null, {
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
    await aws.sendMail({
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
  const log = logger.init(ctxt, null, {
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

const updatePicture = async (ctxt, file, userId) => {
  const log = logger.init(ctxt, null, {
    class: 'user_service',
    method: 'uploadPicture',
  });
  try {
    log.info('Initiating update user picture');
    const extension = {
      'image/png': '.png',
      'image/jpeg': '.jpeg',
    };
    const fileName = `${userId}${extension[file.mimetype]}`;
    log.info(`Uploading file ${fileName} to s3 bucket`);
    await aws.uploadFile({
      bucket: config.userPictureBucket,
      key: fileName,
      body: file.data,
    });
    log.info(`file ${fileName} uploaded successfully to s3 bucket`);
    await userDao.update(ctxt, {
      id: userId,
    }, {
      picture: fileName,
    });
    log.info('Successfully updated user details with latest picture');
    const { Body: body } = await aws.getFile({
      bucket: config.userPictureBucket,
      key: fileName,
    });
    return {
      picture: getImageUri(body, fileName),
    };
  } catch (error) {
    log.error(`Error while updating picture for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
  login,
  verify,
  forgotPassword,
  resetPassword,
  updatePicture,
};
