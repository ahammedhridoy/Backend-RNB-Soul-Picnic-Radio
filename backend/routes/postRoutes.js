const express = require("express");
const { upload } = require("../helpers/multer");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/postController");

const postRouter = express.Router();

// POST /api/v1/post/create
postRouter.post("/create", upload.array("images"), createPost);

// GET /api/v1/post/all
postRouter.get("/all", getAllPosts);

// GET /api/v1/post/:id
postRouter.get("/:id", getSinglePost);

// PATCH /api/v1/post/:id
postRouter.patch("/:id", upload.array("images"), updatePost);

// DELETE /api/v1/post/:id
postRouter.delete("/:id", deletePost);

// DELETE /api/v1/post/:postId/like
postRouter.post("/:postId/like", toggleLike);

module.exports = postRouter;
