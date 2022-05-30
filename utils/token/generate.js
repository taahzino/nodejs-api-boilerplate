const jwt = require("jsonwebtoken");

const generateToken = (tokenData) => {
    return jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;
