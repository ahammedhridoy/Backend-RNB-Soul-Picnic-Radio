const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const path = require("path");
const fs = require("fs");

/**
 * METHOD: POST
 * API: /api/v1/report/register
 */
const reportPost = async (req, res) => {
  try {
    const { postId, reporterId, reason } = req.body;

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the report already exists
    const existingReport = await prisma.report.findFirst({
      where: { postId, reporterId },
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ message: "You have already reported this post." });
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        post: { connect: { id: postId } }, // Proper relation mapping
        reporter: { connect: { id: reporterId } }, // Proper relation mapping
        reason,
      },
    });

    res.status(201).json({ message: "Post reported successfully.", report });
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  reportPost,
};
