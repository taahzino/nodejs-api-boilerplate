// Dependencies
const express = require("express");

// Internal Modules
const {
    registerUser,
    loginUser,
    getMe,
} = require("../controllers/userController");
const { authGuard } = require("../middlewares/authMiddleware");

// Create the Router
const router = express.Router();

// Request Handling
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", authGuard, getMe);

// Export the router
module.exports = router;
