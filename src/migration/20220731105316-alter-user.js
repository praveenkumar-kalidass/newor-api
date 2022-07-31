module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'verification_token');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'User',
      'verification_token',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );
  },
};
