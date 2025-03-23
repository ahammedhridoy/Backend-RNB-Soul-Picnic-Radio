const express = require("express");
const {
  blockUser,
  unblockUser,
  getBlockedUsers,
} = require("../controllers/blockController");

const blockRouter = express.Router();

// POST /api/v1/user/block
blockRouter.post("/block", blockUser);

// POST /api/v1/user/unblock
blockRouter.post("/unblock", unblockUser);

// POST /api/v1/user/blocked/:userId
blockRouter.get("/blocked/:userId", getBlockedUsers);

module.exports = blockRouter;
