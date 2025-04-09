'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_admin: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      verification_token: DataTypes.STRING,
      reset_token_expiration: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
