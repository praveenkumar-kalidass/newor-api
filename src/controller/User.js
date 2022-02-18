const userService = require('../service/User');

const signupV1 = async (request, response) => {
  try {
    const result = await userService.signup(request.body);
    response.status(200).send(result);
  } catch (error) {
    response.status(error.status).send(error.data);
  }
};

module.exports = {
  signupV1,
};
