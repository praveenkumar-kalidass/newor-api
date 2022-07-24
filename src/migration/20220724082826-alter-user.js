module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'User',
      'verification_token',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'User',
      'is_verified',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'verification_token');
    await queryInterface.removeColumn('User', 'is_verified');
  },
};
