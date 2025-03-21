const express = require("express");
const {
  reportPost,
  getAllReports,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

const reportRouter = express.Router();

// POST /api/v1/report/register
reportRouter.post("/register", reportPost);

// POST /api/v1/report/all
reportRouter.get("/all", getAllReports);

// POST /api/v1/report/update/:id
reportRouter.patch("/update/:id", updateReport);

// POST /api/v1/report/delete/:id
reportRouter.delete("/delete/:id", deleteReport);

module.exports = reportRouter;
