// Dependencies
const bcrypt = require("bcryptjs");

// Modules
const { User } = require("../../models");
const { token } = require("../../utils");

// @desc Authentication an user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        error: "Email or Phone number is required!",
      });
    }

    let userID;

    if (email) {
      userID = { email };
    } else {
      userID = { phone };
    }

    if (!password) {
      return res.status(400).json({
        error: "Password is required!",
      });
    }

    // Check user by email/phone
    const user = await User.findOne(userID);

    userID = null;

    if (user && (await bcrypt.compare(password, user.password))) {
      res.locals.user = {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      const jwt = token.generate(res.locals.user);

      res.cookie(process.env.APP_NAME, jwt, {
        maxAge: process.env.JWT_EXPIRY_TIME,
        httpOnly: true,
        signed: true,
      });

      return res.status(201).json({
        ...res.locals.user,
        message: "Logged in successfully!",
      });
    } else {
      return res.status(400).json({
        error: "Invalid credentials!",
      });
    }
  } catch {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = loginUser;
