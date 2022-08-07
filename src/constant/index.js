const AUTH_GRANT_TYPE = {
  PASSWORD: 'password',
  REFRESH_TOKEN: 'refresh_token',
  AUTHORIZATION_CODE: 'authorization_code',
};

const VERIFICATION_MAIL = {
  SUBJECT: 'Email verification with Newor',
  SUCCESS: 'Email verification success!',
  FAILURE: 'Email verification failed!',
  PASSWORD_RESET: 'Reset password with Newor',
};

const APP = {
  DEEPLINKING_HOST: 'newor://',
  SERVICE_NAME: 'newor-api',
};

module.exports = {
  AUTH_GRANT_TYPE,
  VERIFICATION_MAIL,
  APP,
};
