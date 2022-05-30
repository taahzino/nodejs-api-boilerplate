// Dependencies
const asyncHandler = require("express-async-handler");
const { token } = require("../../utils");

// Modules
const { User } = require("../../models");

const authGuard = asyncHandler(async (req, res, next) => {
  const jwt = req.signedCookies[process.env.APP_NAME] || false;
  if (jwt) {
    try {
      const user = await token.verify(jwt);

      res.locals.user = user;

      next();
    } catch (err) {
      res.status(401).json({
        error: "Authentication failure!",
      });
    }
  } else {
    res.status(401).json({
      error: "Authentication failure!",
    });
  }
});

module.exports = authGuard;
