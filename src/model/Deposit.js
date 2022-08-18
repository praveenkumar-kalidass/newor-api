module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
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
    initial: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'initial',
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'value',
    },
    depositoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'depository_name',
    },
    startedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'started_at',
    },
    maturityAt: {
      type: DataTypes.DATEONLY,
      field: 'maturity_at',
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'asset_id',
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
  Deposit.associate = (models) => {
    Deposit.belongsTo(models.User, {
      as: 'asset',
      foreignKey: 'assetId',
      targetKey: 'id',
      onDelete: 'SET NULL',
    });
  };
  return Deposit;
};
