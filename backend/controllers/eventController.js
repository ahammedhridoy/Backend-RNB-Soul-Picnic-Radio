const prisma = require("../utils/prismaClient"); // Path to your Prisma client
const fs = require("fs");
const path = require("path");

// Create Event
const createEvent = async (req, res) => {
  try {
    const { title, date, url, secondDate } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        url,
        secondDate: secondDate ? new Date(secondDate) : null,
        image: imageUrl,
      },
    });

    res
      .status(201)
      .json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating event.", error: error.message });
  }
};

// Get All events
const getAllEvents = async (req, res) => {
  try {
    // Fetch all events from the database
    const events = await prisma.event.findMany({
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ message: "events fetched successfully.", events });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events.", error: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, url, secondDate } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    // If a new image is uploaded, delete the old one
    if (imageUrl && existingEvent.image) {
      const oldImagePath = path.join(__dirname, "..", existingEvent.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        url,
        secondDate: secondDate ? new Date(secondDate) : null,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    if (!updatedEvent) {
      return res
        .status(500)
        .json({ message: "Error updating event.", error: error.message });
    }

    res
      .status(200)
      .json({ message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog.", error: error.message });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the event
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "event not found." });
    }

    // Delete the image file (if exists)
    if (event.image) {
      const filePath = path.join(__dirname, "..", event.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err.message);
        }
      });
    }

    // Delete the event
    await prisma.event.delete({
      where: { id },
    });

    res.status(200).json({ message: "event deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event.", error: error.message });
  }
};

module.exports = {
  deleteEvent,
  updateEvent,
  getAllEvents,
  createEvent,
};
