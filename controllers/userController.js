// Dependencies
const bcrypt = require("bcryptjs");
const asyncHanlder = require("express-async-handler");

// Modules
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { authGuard } = require("../middlewares/authMiddleware");

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = asyncHanlder(async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        res.status(400);
        throw new Error("All fields are required!");
    }

    if (phone.length !== 11) {
        res.status(400);
        throw new Error("Phone number must be exact 11 characters long and Bangladeshi!");
    }

    // Check if the user exists
    const emailExists = await User.findOne({ email });
    const phoneExists = await User.findOne({ phone });

    if (emailExists) {
        res.status(400);
        throw new Error("Email already exists!");
    }

    if (phoneExists) {
        res.status(400);
        throw new Error("Phone number already exists!");
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
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            message: 'Registered successfully!',
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data!");
    }
});

// @desc Authentication an user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHanlder(async (req, res) => {
    const { email, phone, password } = req.body;
    
    let userID;

    if (!email && !phone) {
        res.status(400);
        throw new Error("Email or Phone number is required!");
    }
    if (email) {
        userID = { email };
    } else {
        userID = { phone };
    }
    if (!password) {
        res.status(400);
        throw new Error("Password is required!");
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

        const token = generateToken(res.locals.user);

        res.cookie(process.env.APP_NAME, token, {
            maxAge: process.env.JWT_EXPIRY_TIME,
            httpOnly: true,
            signed: true,
        });

        res.status(201).json({
            ...res.locals.user,
            message: 'Logged in successfully!',
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials!");
    }
});

// @desc GET user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHanlder(async (req, res) => {
    res.json(res.locals.user);
});

module.exports = { registerUser, loginUser, getMe };
