const { PrismaClient } = require("@prisma/client");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const eventRouter = require("./routes/eventRoutes");
const formRouter = require("./routes/form");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS Configuration
const corsConfig = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8081",
    "exp://192.168.0.199:8081",
    "http://192.168.0.199:8081",
    "http://127.0.0.1:8081",
    "exp://127.0.0.1:8081",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: true,
};

app.use(cors(corsConfig));
app.options("", cors(corsConfig));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

// Database connection check
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}
checkDatabaseConnection();

// Define API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1", formRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
