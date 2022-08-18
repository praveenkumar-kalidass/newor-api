module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Deposit', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'type',
      },
      interestRate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'interest_rate',
      },
      initial: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'initial',
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'value',
      },
      depositoryName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'depository_name',
      },
      startedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: 'started_at',
      },
      maturityAt: {
        type: Sequelize.DATEONLY,
        field: 'maturity_at',
      },
      assetId: {
        type: Sequelize.UUID,
        field: 'asset_id',
        references: {
          model: {
            tableName: 'Asset',
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
    await queryInterface.dropTable('Deposit');
  },
};
