const express = require("express");
const {
  reportPost,
  getAllReports,
  updateReport,
  deleteReport,
  getUserReport,
} = require("../controllers/reportController");
const { verifyUser } = require("../controllers/authController");

const reportRouter = express.Router();

// POST /api/v1/report/register
reportRouter.post("/register", reportPost);

// POST /api/v1/report/all
reportRouter.get("/all", verifyUser, getAllReports);

// POST /api/v1/report/update/:id
reportRouter.patch("/update/:id", verifyUser, updateReport);

// POST /api/v1/report/delete/:id
reportRouter.delete("/delete/:id", verifyUser, deleteReport);

// POST /api/v1/report/user/:id
reportRouter.get("/user/:id", getUserReport);

module.exports = reportRouter;
