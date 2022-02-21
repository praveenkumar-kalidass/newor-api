'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'User', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        firstName: {
          type: Sequelize.STRING(25),
          allowNull: false,
          field: 'first_name',
        },
        lastName: {
          type: Sequelize.STRING(25),
          allowNull: false,
          field: 'last_name',
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
          field: 'email',
        },
        password: {
          type: Sequelize.STRING(56),
          allowNull: false,
          field: 'password',
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
      },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('User');
  },
};
