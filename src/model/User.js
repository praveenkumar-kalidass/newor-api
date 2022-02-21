const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  return User;
};
