module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING(56),
      allowNull: false,
      field: 'password',
    },
    mobileNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      field: 'mobile_number',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verified',
    },
    picture: {
      type: DataTypes.STRING(50),
      unique: true,
      filed: 'picture',
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
