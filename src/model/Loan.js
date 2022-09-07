module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'type',
    },
    interestRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'interest_rate',
    },
    principal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'principal',
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'value',
    },
    lenderName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'lender_name',
    },
    startedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'started_at',
    },
    closingAt: {
      type: DataTypes.DATEONLY,
      field: 'closing_at',
    },
    liabilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'liability_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    freezeTableName: true,
    timestamps: true,
  });
  Loan.associate = (models) => {
    Loan.belongsTo(models.User, {
      as: 'liability',
      foreignKey: 'liabilityId',
      targetKey: 'id',
      onDelete: 'SET NULL',
    });
  };
  return Loan;
};
