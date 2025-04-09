'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posts.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      excerpt: DataTypes.TEXT,
      status: DataTypes.STRING,
      view_Count: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      published_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'posts',
    }
  );
  return posts;
};
