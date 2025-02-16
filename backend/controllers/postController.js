const prisma = require("../utils/prismaClient");
const fs = require("fs");
const path = require("path");

/**
 * METHOD: POST
 * API: /api/v1/post/create
 */
const createPost = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID and text are required." });
    }

    // Check if user exists
    const user = await prisma.generalUser.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create post
    const newPost = await prisma.post.create({
      data: {
        authorId: user?.id,
        text,
        images: imageUrls,
        userId,
      },
    });

    res
      .status(201)
      .json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "Error creating post.", error: error.message });
  }
};

// ✅ Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ message: "Posts fetched successfully.", posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts.", error: error.message });
  }
};

// ✅ Get Single Post by ID
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ message: "Post fetched successfully.", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post.", error: error.message });
  }
};

// ✅ Update Post (Handle Multiple Images)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const newImageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Check if post exists
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Delete old images if new ones are uploaded
    if (newImageUrls.length > 0 && existingPost.images.length > 0) {
      existingPost.images.forEach((imagePath) => {
        const filePath = path.join(__dirname, "..", imagePath);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        text,
        images: newImageUrls.length > 0 ? newImageUrls : existingPost.images,
      },
    });

    res
      .status(200)
      .json({ message: "Post updated successfully.", post: updatedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post.", error: error.message });
  }
};

// ✅ Delete Post (Handle Multiple Images)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find post
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Delete image files
    if (post.images.length > 0) {
      post.images.forEach((imagePath) => {
        const filePath = path.join(__dirname, "..", imagePath);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err.message);
        });
      });
    }

    // Delete post
    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post.", error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { likes: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    let updatedLikes;
    if (post.likes.includes(userId)) {
      // Unlike: Remove userId from likes array
      updatedLikes = post.likes.filter((id) => id !== userId);
    } else {
      // Like: Add userId to likes array
      updatedLikes = [...post.likes, userId];
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { set: updatedLikes } }, // ✅ Use Prisma set to update array
      select: { likes: true },
    });

    res.json({ message: "Like toggled", likes: updatedPost.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
};
