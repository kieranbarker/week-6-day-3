const express = require("express");
const { Post } = require("../db/models/index.js");

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  // Creates a new post and sends a "201 Created" response.
  const { title, body } = req.body;
  const post = await Post.create({ title, body });
  res.status(201).json(post);
});

router.get("/", async (req, res) => {
  // Gets all posts and sends a "200 OK" response.
  const posts = await Post.findAll();
  res.status(200).json(posts);
});

router.get("/:postId", async (req, res) => {
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

router.put("/:postId", async (req, res) => {
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

router.delete("/:postId", async (req, res) => {
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

router.get("/:postId/comments", async (req, res) => {
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

module.exports = router;
