const express = require("express");
const {
  register,
  login,
  resetPassword,
  logout,
  verifyUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const authRouter = express.Router();

// POST /api/v1/auth/register
authRouter.post("/register", verifyUser, register);

// POST /api/v1/auth/login
authRouter.post("/login", login);

// POST /api/v1/auth/user/all
authRouter.get("/user/all", verifyUser, getAllUsers);

// POST /api/v1/auth/user/:id
authRouter.get("/user/:id", verifyUser, getSingleUser);

// POST /api/v1/auth/user/update/:id
authRouter.patch("/user/update/:id", verifyUser, updateUser);

// POST /api/v1/auth/user/delete/:id
authRouter.delete("/user/delete/:id", verifyUser, deleteUser);

// POST /api/v1/auth/forgot-password
authRouter.post("/forgot-password", forgotPassword);

// POST /api/v1/auth/reset-password
authRouter.post("/reset-password", resetPassword);

// POST /api/v1/auth/logout
authRouter.post("/logout", verifyUser, logout);

module.exports = authRouter;
