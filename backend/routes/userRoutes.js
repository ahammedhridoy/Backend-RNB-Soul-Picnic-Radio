const express = require("express");
const { registerUser } = require("../controllers/userController");

const userRouter = express.Router();

// POST /api/v1/user/register
userRouter.post("/register", registerUser);

module.exports = userRouter;
