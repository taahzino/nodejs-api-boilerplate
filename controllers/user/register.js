// Dependencies
const bcrypt = require("bcryptjs");
const asyncHanlder = require("express-async-handler");

// Modules
const { User } = require("../../models");

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (phone.length !== 11) {
      return res.status(400).json({
        error: "Phone number must be 11 characters long!",
      });
    }

    // Check if the user exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        error: "Email already exists!",
      });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        error: "Phone number already exists!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        message: "Registered successfully!",
      });
    } else {
      return res.status(400).json({ error: "Invalid user data!" });
    }
  } catch {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = registerUser;
