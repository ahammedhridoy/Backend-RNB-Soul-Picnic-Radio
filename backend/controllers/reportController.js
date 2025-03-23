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
      // Update the existing report with the new reason
      const updatedReport = await prisma.report.update({
        where: { id: existingReport.id },
        data: { reason }, // Update only the reason field
      });

      return res
        .status(200)
        .json({ message: "Report updated successfully.", updatedReport });
    }

    // Create a new report if it doesn't exist
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

const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        post: true,
        reporter: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // ✅ If you only want reports with an existing post, filter out reports with `null` posts
    const validReports = reports.filter((report) => report.post !== null);

    res.status(200).json({
      message: "Reports fetched successfully.",
      reports: validReports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = await prisma.report.findMany({
      where: { reporterId: id },
      include: {
        post: true,
        reporter: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ message: "Reports fetched successfully.", reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await prisma.report.delete({
      where: { id },
    });
    res.status(200).json({ message: "Report deleted successfully.", report });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const { reportStatus } = req.body;

    if (!reportStatus) {
      return res.status(400).json({ message: "Report status is required" });
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { reportStatus },
    });

    res
      .status(200)
      .json({ message: "Report updated successfully.", updatedReport });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  reportPost,
  getAllReports,
  deleteReport,
  updateReport,
  getUserReport,
};
