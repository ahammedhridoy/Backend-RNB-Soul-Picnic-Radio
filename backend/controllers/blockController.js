const prisma = require("../utils/prismaClient");

// Block a user
const blockUser = async (req, res) => {
  try {
    const { userId, blockUserId, blockUserName } = req.body;

    if (!userId || !blockUserId || !blockUserName) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    // Prevent self-blocking
    if (userId === blockUserId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    // Fetch the user's blocked list
    const user = await prisma.generalUser.findUnique({
      where: { id: userId },
      select: { blockedUsers: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure blockedUsers is always an array
    const blockedUsers = Array.isArray(user.blockedUsers)
      ? user.blockedUsers
      : [];

    // Check if the user is already blocked
    const isAlreadyBlocked = blockedUsers.some(
      (blocked) => blocked.id === blockUserId
    );
    if (isAlreadyBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    // Update the blocked users list
    const updatedUser = await prisma.generalUser.update({
      where: { id: userId },
      data: {
        blockedUsers: {
          set: [...blockedUsers, { id: blockUserId, name: blockUserName }], // Update JSON properly
        },
      },
    });

    res.status(200).json({ message: "User blocked successfully", updatedUser });
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

    const user = await prisma.generalUser.findUnique({
      where: { id: userId },
      select: { blockedUsers: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the `set` array from blockedUsers
    const blockedUsers = user.blockedUsers?.set || [];

    // Check if the user is actually blocked
    const isBlocked = blockedUsers.some(
      (blocked) => blocked.id === unblockUserId
    );
    if (!isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    // Remove the user from blocked list
    const updatedBlockedUsers = blockedUsers.filter(
      (blocked) => blocked.id !== unblockUserId
    );

    // Update the database with the new blockedUsers array
    const updatedUser = await prisma.generalUser.update({
      where: { id: userId },
      data: {
        blockedUsers: {
          set: updatedBlockedUsers, // Correctly update the `set` array
        },
      },
    });

    res
      .status(200)
      .json({ message: "User unblocked successfully", updatedUser });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get blocked users list
const getBlockedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.generalUser.findUnique({
      where: { id: userId },
      select: { blockedUsers: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure blockedUsers exists and extract `set` array
    let blockedUsers = user.blockedUsers?.set || [];

    res.status(200).json({ blockedUsers });
  } catch (error) {
    console.error("Error getting blocked users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { blockUser, unblockUser, getBlockedUsers };
