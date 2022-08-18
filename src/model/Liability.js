module.exports = (sequelize, DataTypes) => {
  const Liability = sequelize.define('Liability', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    list: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'list',
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
  Liability.associate = (models) => {
    Liability.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'SET NULL',
    });
  };
  return Liability;
};
