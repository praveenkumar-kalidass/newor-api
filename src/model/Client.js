const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  return Client;
};
