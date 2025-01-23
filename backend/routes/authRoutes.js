const express = require("express");
const {
  register,
  login,
  resetPassword,
  logout,
  verifyAdmin,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  verifyUser,
  verifyEditor,
  verifyRole,
  forgotPassword,
} = require("../controllers/authController");

const authRouter = express.Router();

// POST /api/v1/auth/register
authRouter.post("/register", register);

// POST /api/v1/auth/login
authRouter.post("/login", login);

// POST /api/v1/auth/forgot-password
authRouter.post("/forgot-password", forgotPassword);

// POST /api/v1/auth/reset-password
authRouter.post("/reset-password", resetPassword);

// POST /api/v1/auth/logout
authRouter.post("/logout", logout);

module.exports = authRouter;
