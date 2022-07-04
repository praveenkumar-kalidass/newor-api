module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Client', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(25),
        allowNull: false,
        field: 'name',
      },
      secret: {
        type: Sequelize.STRING(56),
        allowNull: false,
        field: 'secret',
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Client');
  },
};
