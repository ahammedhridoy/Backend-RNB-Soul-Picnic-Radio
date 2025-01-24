const express = require("express");
const { upload } = require("../helpers/multer");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { verifyUser } = require("../controllers/authController");

const eventRouter = express.Router();

// Create a new Event
eventRouter.post("/create", verifyUser, upload.single("image"), createEvent);

// Get all Events
eventRouter.get("/all", getAllEvents);

// Update a Event
eventRouter.patch("/:id", verifyUser, upload.single("image"), updateEvent);

// Delete a Event
eventRouter.delete("/:id", verifyUser, deleteEvent);

module.exports = eventRouter;
