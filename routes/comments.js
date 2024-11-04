const express = require("express");
const { Comment } = require("../db/models/index.js");

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  // Creates a new comment and sends a "201 Created" response.
  const { PostId, name, email, body } = req.body;
  const comment = await Comment.create({ PostId, name, email, body });
  res.status(201).json(comment);
});

router.get("/", async (req, res) => {
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

router.get("/:commentId", async (req, res) => {
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

router.put("/:commentId", async (req, res) => {
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

router.delete("/:commentId", async (req, res) => {
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

module.exports = router;
