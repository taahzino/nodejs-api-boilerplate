// Dependencies
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");

// Configure dotenv
dotenv.config();

// Establish database connection
const connectDB = require("./config/database");
connectDB();

// Internal Modules
const { error: errorHandler } = require("./middlewares/common");

// Get Environment Vairables
const { PORT } = process.env;

// Create Express App
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use(errorHandler);

// Start the app
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
