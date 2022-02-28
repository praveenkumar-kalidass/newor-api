const error = require('./error');

describe('error', () => {
  it('should match snapshot', () => {
    expect(error).toMatchSnapshot();
  });
});
