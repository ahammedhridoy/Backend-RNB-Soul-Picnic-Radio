const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const generateToken = require("../utils/generateToken");
const path = require("path");
const fs = require("fs");
const { sendForgotPasswordEmail } = require("../helpers/nodemailer");

/**
 * METHOD: POST
 * API: /api/v1/user/register
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, agreed } = req.body;

    // Validate user input
    if (!firstName || !email || !lastName || !password || !agreed) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.generalUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.generalUser.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        agreedToEULA: agreed,
      },
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * METHOD: POST
 * API: /api/v1/user/login
 */

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.generalUser.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, accessTokenExp } = await generateToken(user);

    if (!accessToken || !accessTokenExp)
      throw new Error("Failed to generate tokens.");
    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      accessToken,
      accessTokenExp,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * METHOD: POST
 * API: /api/v1/auth/login
 */

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ message: "Users fetched successfully.", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
};

// Get User by ID
const getSingleUser = async (req, res) => {
  const { id } = req.params;

  console.log("Received ID:", id, "Type:", typeof id);
  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid or missing user ID." });
    }

    const user = await prisma.generalUser.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User fetched successfully.", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user.", error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received ID:", id, "Type:", typeof id);

    if (!id) {
      return res.status(400).json({ message: "Invalid or missing user ID." });
    }

    const { firstName, lastName, email, password } = req.body;

    if (!firstName && !lastName && !email) {
      return res
        .status(400)
        .json({ message: "Please enter at least one field to update." });
    }

    // Validate input fields
    if (password && password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    let imageUrl;

    // Ensure the user exists
    const user = await prisma.generalUser.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle Image Deletion and Update
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;

      if (user.imageUrl && user.imageUrl !== "/uploads/defaultImage.png") {
        const oldImagePath = path.join(__dirname, "..", user.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Error deleting old image:", err);
          }
        });
      }
    }

    // Construct Update Object
    const updatedData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
      ...(imageUrl && { imageUrl }),
    };

    // Update the User
    const updatedUser = await prisma.generalUser.update({
      where: { id },
      data: updatedData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user.", error: error.message });
  }
};

// Delete User

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received ID for deletion:", id, "Type:", typeof id);

    if (!id) {
      return res.status(400).json({ message: "Invalid or missing user ID." });
    }

    // Ensure the user exists
    const user = await prisma.generalUser.findUnique({
      where: { id },
      include: { posts: { include: { reports: true } }, reports: true }, // Include reports and posts
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 1. Delete reports where the user is the reporter
    await prisma.report.deleteMany({
      where: { reporterId: id },
    });

    // ✅ 2. Delete reports associated with the user's posts
    const userPostIds = user.posts.map((post) => post.id);
    if (userPostIds.length > 0) {
      await prisma.report.deleteMany({
        where: { postId: { in: userPostIds } },
      });
    }

    // ✅ 3. Delete the user's posts (after removing associated reports)
    if (user.posts.length > 0) {
      // Delete associated images from the file system
      for (const post of user.posts) {
        if (post.images.length > 0) {
          post.images.forEach((image) => {
            const imagePath = path.join(__dirname, "..", image);
            fs.unlink(imagePath, (err) => {
              if (err && err.code !== "ENOENT") {
                console.error("Error deleting post image:", err);
              }
            });
          });
        }
      }

      // Delete posts
      await prisma.post.deleteMany({
        where: { authorId: id },
      });
    }

    // ✅ 4. Delete user profile image (except default)
    if (user.imageUrl && user.imageUrl !== "/uploads/defaultImage.png") {
      const imagePath = path.join(__dirname, "..", user.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting profile image:", err);
        }
      });
    }

    // ✅ 5. Finally, delete the user
    await prisma.generalUser.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "User and associated data deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user.", error: error.message });
  }
};

// Forgot Password

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    const user = await prisma.generalUser.findUnique({
      where: { email },
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new password
    const generatedPassword = Math.random().toString(36).slice(-8);
    console.log(generatedPassword);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    await prisma.generalUser.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Send email with new password
    await sendForgotPasswordEmail(email, generatedPassword);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
  }
};

// Block a user
const blockUser = async (req, res) => {
  try {
    const { userId, blockedUserId } = req.body;

    // Check if the user exists
    const user = await prisma.generalUser.findUnique({ where: { id: userId } });
    const blockedUser = await prisma.generalUser.findUnique({
      where: { id: blockedUserId },
    });

    if (!user || !blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already blocked
    if (user.blockedUsers.includes(blockedUserId)) {
      return res.status(400).json({ message: "User is already blocked." });
    }

    // Update the user's blocked list
    await prisma.generalUser.update({
      where: { id: userId },
      data: { blockedUsers: { push: blockedUserId } },
    });

    res.status(200).json({ message: "User blocked successfully." });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export
module.exports = {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  login,
  forgotPassword,
  deleteUser,
  blockUser,
};
