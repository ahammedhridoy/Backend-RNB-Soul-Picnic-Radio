const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

/**
 * METHOD: POST
 * API: /api/v1/user/register
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate user input
    if (!firstName || !email || !lastName || !password) {
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
      data: { email, firstName, lastName, password: hashedPassword },
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
// const getSingleUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id || !ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid or missing user ID." });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: id.toString() },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({ message: "User fetched successfully.", user });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching user.", error: error.message });
//   }
// };

// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received ID:", id);

    const { firstName, lastName, email, password } = req.body;

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
  // getSingleUser,
  updateUser,
  login,
};
