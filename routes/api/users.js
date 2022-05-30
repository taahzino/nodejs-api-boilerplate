// Dependencies
const express = require("express");

// Internal Modules
const { user: userController } = require("../../controllers");
const { auth } = require("../../middlewares");

// Create the Router
const router = express.Router();

// Request Handling
router
  .post("/", userController.register)
  .get("/me", auth.guard, userController.getUser)
  .post("/login", userController.login);

// Export the router
module.exports = router;
