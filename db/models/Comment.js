const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection.js");

class Comment extends Model {}

Comment.init(
  {
    name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    body: DataTypes.TEXT,
  },
  {
    sequelize,
  }
);

module.exports = Comment;
