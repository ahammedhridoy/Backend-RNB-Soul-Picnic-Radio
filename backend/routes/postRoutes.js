const express = require("express");
const { upload } = require("../helpers/multer");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
  getUserPosts,
} = require("../controllers/postController");

const postRouter = express.Router();

// POST /api/v1/post/create
postRouter.post("/create", upload.array("images"), createPost);

// GET /api/v1/post/all
postRouter.get("/all", getAllPosts);

// GET /api/v1/post/:postId
postRouter.get("/:postId", getSinglePost);

// GET /api/v1/post/:userId/posts
postRouter.get("/user/:authorId", getUserPosts);

// PATCH /api/v1/post/:id
postRouter.patch("/:id", upload.array("images"), updatePost);

// DELETE /api/v1/post/:id
postRouter.delete("/:id", deletePost);

// DELETE /api/v1/post/:postId/like
postRouter.post("/:postId/likes", toggleLike);

module.exports = postRouter;
