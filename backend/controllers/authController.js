const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");
const cookie = require("cookie");
const {
  sendPasswordResetEmail,
  validateTokenAndGetEmail,
  updatePassword,
  invalidateToken,
} = require("../helpers/utils");
const generateToken = require("../utils/generateToken");
const { ObjectId } = require("mongodb");

/**
 * METHOD: POST
 * API: /api/v1/auth/register
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate user input
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const data = {
      email,
      password: hashedPassword,
      name,
    };

    const user = await prisma.user.create({ data });

    // Remove the password field from the user object before sending the response
    delete user.password;

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * METHOD: POST
 * API: /api/v1/auth/login
 */

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
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

    // Set token in cookies
    res.setHeader("Set-Cookie", [
      cookie.serialize("accessToken", accessToken, {
        httpOnly: false, // Allow access from frontend
        secure: process.env.NODE_ENV === "production",
        maxAge: accessTokenExp,
        path: "/", // Ensure this matches with logout
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
      cookie.serialize("accessTokenExp", accessTokenExp.toString(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: accessTokenExp,
        path: "/", // Ensure this matches with logout
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
      cookie.serialize("user", JSON.stringify(userWithoutPassword), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: accessTokenExp,
        path: "/", // Ensure this matches with logout
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
    ]);

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

// Logout
const logout = async (req, res) => {
  try {
    // Clear the cookies related to authentication
    res.setHeader("Set-Cookie", [
      cookie.serialize("accessToken", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
      cookie.serialize("accessTokenExp", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
      cookie.serialize("user", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
    ]);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

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

  try {
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing user ID." });
    }

    const user = await prisma.user.findUnique({
      where: { id: id.toString() },
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
    const { name, email, role, password } = req.body;

    if (!id || (!name && !email && !role)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Validate input fields
    if (password && password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // Hash the password if provided
    const updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
    };

    // Ensure the user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
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
    const { id } = req.params; // Get user ID from request parameters

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user.", error: error.message });
  }
};

/**
 * METHOD: POST
 * API: /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(404).json({ message: "No email found!" });
  try {
    // Check if the email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const encoded = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5min",
    });

    await prisma.resetToken.create({
      data: {
        email,
        token: encoded,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, encoded, user?.name);

    res.status(200).json({ message: "Password reset email sent", encoded });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error on forgot password" });
  }
};

/**
 * METHOD: POST
 * API: /api/v1/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide both token and new password" });
  }

  try {
    const email = await validateTokenAndGetEmail(token);
    if (!email) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    await updatePassword(email, newPassword);
    await invalidateToken(token);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

// Verify User
const verifyUser = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // Check if token exists and is valid
    if (!token || token.split(".").length !== 3) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Malformed or missing token" });
    }

    // Verify JWT token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request object for downstream middleware/handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying user:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error during verification" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  verifyUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
