const express = require("express");
const { Comment, Post } = require("./db/models/index.js");

const app = express();
app.use(express.json());

//
// Posts
//

app.post("/posts", async (req, res) => {
  // Creates a new post and sends a "201 Created" response.
  const { title, body } = req.body;
  const post = await Post.create({ title, body });
  res.status(201).json(post);
});

app.get("/posts", async (req, res) => {
  // Gets all posts and sends a "200 OK" response.
  const posts = await Post.findAll();
  res.status(200).json(posts);
});

app.get("/posts/:postId", async (req, res) => {
  // Tries to find the post by its ID.
  const { postId } = req.params;
  const post = await Post.findByPk(postId);

  // If the post does not exist, sends a "404 Not Found" response.
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  // Otherwise, sends a 200 OK response.
  res.status(200).json(post);
});

app.put("/posts/:postId", async (req, res) => {
  // Tries to find the post by its ID.
  const { postId } = req.params;
  let post = await Post.findByPk(postId);

  // Gets the post's title and body from the request body.
  const { title, body } = req.body;

  // If the post does not exist, creates it and sends a "201 Created" response.
  if (!post) {
    post = await Post.create({ id: Number(postId), title, body });
    res.status(201).json(post);
    return;
  }

  // Otherwise, updates the post and sends a "200 OK" response.
  post = await post.update({ title, body });
  res.status(200).json(post);
});

app.delete("/posts/:postId", async (req, res) => {
  // Tries to find the post by its ID.
  const { postId } = req.params;
  const post = await Post.findByPk(postId);

  // If the post does not exist, sends a "404 Not Found" response.
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  // Otherwise, deletes the post and sends a "204 No Content" response.
  await post.destroy();
  res.status(204).send();
});

app.get("/posts/:postId/comments", async (req, res) => {
  // Tries to find the post by its ID.
  const { postId } = req.params;
  const post = await Post.findByPk(postId);

  // If the post does not exist, sends an empty array.
  if (!post) {
    res.status(200).json([]);
    return;
  }

  // Otherwise, sends the comments associated with the post.
  const comments = await post.getComments();
  res.status(200).json(comments);
});

//
// Comments
//

app.post("/comments", async (req, res) => {
  // Creates a new comment and sends a "201 Created" response.
  const { PostId, name, email, body } = req.body;
  const comment = await Comment.create({ PostId, name, email, body });
  res.status(201).json(comment);
});

app.get("/comments", async (req, res) => {
  // Tries to get the post ID from the query parameter.
  const { PostId } = req.query;

  // If the post ID is provided, gets all comments with that post ID.
  if (PostId) {
    const comments = await Comment.findAll({ where: { PostId: PostId } });
    res.status(200).json(comments);
    return;
  }

  // Otherwise, gets all comments.
  const comments = await Comment.findAll();
  res.status(200).json(comments);
});

app.get("/comments/:commentId", async (req, res) => {
  // Tries to find the comment by its ID.
  const { commentId } = req.params;
  const comment = await Comment.findByPk(commentId);

  // If the comment does not exist, sends a "404 Not Found" response.
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  // Otherwise, sends a 200 OK response.
  res.status(200).json(comment);
});

app.put("/comments/:commentId", async (req, res) => {
  // Tries to find the comment by its ID.
  const { commentId } = req.params;
  let comment = await Comment.findByPk(commentId);

  // Gets the comment's PostId, name, email, and body from the request body.
  const { PostId, name, email, body } = req.body;

  // If the comment does not exist, creates it and sends a "201 Created" response.
  if (!comment) {
    comment = await Comment.create({
      id: Number(commentId),
      PostId,
      name,
      email,
      body,
    });

    res.status(201).json(comment);
    return;
  }

  // Otherwise, updates the comment and sends a "200 OK" response.
  comment = await comment.update({ PostId, name, email, body });
  res.status(200).json(comment);
});

app.delete("/comments/:commentId", async (req, res) => {
  // Tries to find the comment by its ID.
  const { commentId } = req.params;
  const comment = await Comment.findByPk(commentId);

  // If the comment does not exist, sends a "404 Not Found" response.
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  // Otherwise, deletes the comment and sends a "204 No Content" response.
  await comment.destroy();
  res.status(204).send();
});

module.exports = app;
