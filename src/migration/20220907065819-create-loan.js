module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Loan', {
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
      principal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'principal',
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'value',
      },
      lenderName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'lender_name',
      },
      startedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: 'started_at',
      },
      closingAt: {
        type: Sequelize.DATEONLY,
        field: 'closing_at',
      },
      liabilityId: {
        type: Sequelize.UUID,
        field: 'liability_id',
        references: {
          model: {
            tableName: 'Liability',
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
    await queryInterface.dropTable('Loan');
  },
};
