const express = require("express");
const { registerUser, login } = require("../controllers/userController");

const userRouter = express.Router();

// POST /api/v1/user/register
userRouter.post("/register", registerUser);

// POST /api/v1/user/login
userRouter.post("/login", login);

module.exports = userRouter;
