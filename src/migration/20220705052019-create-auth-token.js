module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuthToken', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      accessToken: {
        type: Sequelize.STRING,
        field: 'access_token',
        allowNull: false,
      },
      accessTokenExpiresAt: {
        type: Sequelize.DATE,
        field: 'access_token_expires_at',
        allowNull: false,
      },
      clientId: {
        type: Sequelize.UUID,
        field: 'client_id',
        references: {
          model: {
            tableName: 'Client',
          },
        },
      },
      refreshToken: {
        type: Sequelize.STRING,
        field: 'refresh_token',
        allowNull: false,
      },
      refreshTokenExpiresAt: {
        type: Sequelize.DATE,
        field: 'refresh_token_expires_at',
        allowNull: false,
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
    await queryInterface.dropTable('AuthToken');
  },
};
