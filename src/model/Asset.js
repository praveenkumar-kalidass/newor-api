module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
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
  Asset.associate = (models) => {
    Asset.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'SET NULL',
    });
  };
  return Asset;
};
