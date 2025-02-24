const express = require("express");
const {
  registerUser,
  login,
  updateUser,
  forgotPassword,
} = require("../controllers/userController");
const { upload } = require("../helpers/multer");

const userRouter = express.Router();

// POST /api/v1/user/register
userRouter.post("/register", registerUser);

// POST /api/v1/user/login
userRouter.post("/login", login);

// PATCH /api/v1/user/update/single/:id
userRouter.patch("/update/single/:id", upload.single("imageUrl"), updateUser);

// POST /api/v1/user/update/password
userRouter.post("/update/password", forgotPassword);

module.exports = userRouter;
