const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const { ObjectId } = require("mongodb");

/**
 * METHOD: POST
 * API: /api/v1/user/register
 */
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate user input
    if (!name || !email) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.generalUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // 409: Conflict
    }

    // Create the new user
    const user = await prisma.generalUser.create({
      data: { email, name },
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

module.exports = {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
