const prisma = require("../utils/prismaClient");

// Block a user
const blockUser = async (req, res) => {
  try {
    const { userId, blockUserId, blockUserName } = req.body;

    if (!userId || !blockUserId || !blockUserName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (userId === blockUserId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    // Check if user exists
    const userExists = await prisma.generalUser.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already blocked
    const existingBlock = await prisma.blockedUser.findFirst({
      where: {
        blockerId: userId,
        blockedId: blockUserId,
      },
    });

    if (existingBlock) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    // Create block
    const blockedUser = await prisma.blockedUser.create({
      data: {
        blockerId: userId,
        blockedId: blockUserId,
        blockedName: blockUserName,
      },
    });

    res.status(201).json({
      message: "User blocked successfully",
      blockedUser,
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const { userId, unblockUserId } = req.body;

    if (!userId || !unblockUserId) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    // Delete the block record
    const deleteResult = await prisma.blockedUser.deleteMany({
      where: {
        blockerId: userId,
        blockedId: unblockUserId,
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: "Block record not found" });
    }

    res.status(200).json({
      message: "User unblocked successfully",
      unblockUserId,
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get blocked users list
const getBlockedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const blockedUsers = await prisma.blockedUser.findMany({
      where: {
        blockerId: userId,
      },
      select: {
        id: true,
        blockedId: true,
        blockedName: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ blockedUsers });
  } catch (error) {
    console.error("Error getting blocked users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { blockUser, unblockUser, getBlockedUsers };
