module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'User',
      'picture',
      {
        type: Sequelize.STRING(50),
        unique: true,
      },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'picture');
  },
};
