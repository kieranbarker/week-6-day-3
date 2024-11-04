const Post = require("./Post.js");
const Comment = require("./Comment.js");

Post.hasMany(Comment);
Comment.belongsTo(Post);

module.exports = {
  Post,
  Comment,
};
