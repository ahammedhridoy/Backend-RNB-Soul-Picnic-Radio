const express = require("express");
const { reportPost } = require("../controllers/reportController");

const reportRouter = express.Router();

// POST /api/v1/report/register
reportRouter.post("/register", reportPost);

module.exports = reportRouter;
