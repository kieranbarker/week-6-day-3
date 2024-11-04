const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection.js");

class Post extends Model {}

Post.init(
  {
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
  },
  {
    sequelize,
  }
);

module.exports = Post;
