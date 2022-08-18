module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Asset', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        field: 'user_id',
        references: {
          model: {
            tableName: 'User',
          },
        },
      },
      list: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        field: 'list',
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
    await queryInterface.dropTable('Asset');
  },
};
