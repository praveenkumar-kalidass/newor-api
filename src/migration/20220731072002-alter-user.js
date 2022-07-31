module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'User',
      'mobile_number',
      {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('User', 'mobile_number');
  },
};
