const errors = {
  isNeworError: (error) => Boolean(error.data && error.data.code.match('NEWOR_')),
  INTERNAL_SERVER_ERROR: {
    status: 500,
    data: {
      code: 'NEWOR_INTERNAL_SERVER_ERROR',
      description: 'Internal Server error',
    },
  },
  BAD_REQUEST: {
    status: 400,
    data: {
      code: 'NEWOR_BAD_REQUEST',
      description: 'Bad request',
    },
  },
  REDIRECT: {
    status: 307,
    data: {
      code: 'NEWOR_REDIRECT',
      description: 'Redirect',
    },
  },
  INVALID_CREDENTIALS: {
    status: 401,
    data: {
      code: 'NEWOR_INVALID_CREDENTIALS',
      description: 'Invalid credentials.',
    },
  },
  USER_NOT_FOUND: {
    status: 404,
    data: {
      code: 'NEWOR_USER_NOT_FOUND',
      description: 'User not found.',
    },
  },
  CLIENT_NOT_FOUND: {
    status: 404,
    data: {
      code: 'NEWOR_CLIENT_NOT_FOUND',
      description: 'Client not found.',
    },
  },
  EMAIL_NOT_VERIFIED: {
    status: 403,
    data: {
      code: 'NEWOR_EMAIL_NOT_VERIFIED',
      description: 'Email verification incomplete.',
    },
  },
};

module.exports = errors;
