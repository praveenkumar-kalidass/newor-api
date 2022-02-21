const errors = {
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
};

module.exports = errors;
