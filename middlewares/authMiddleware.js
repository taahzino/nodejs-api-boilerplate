// Dependencies
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const asyncHandler = require("express-async-handler");

// Modules
const User = require("../models/userModel");

// Functions
const authGuard = asyncHandler(async (req, res, next) => {
    const token = req.signedCookies[process.env.APP_NAME] || false;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const doc = await User.findById(decoded._id);

            const user = lodash.cloneDeep(doc.toObject());
            
            user.password = undefined;
            
            res.locals.user = user;

            next();
        } catch (err) {
            console.log('error 1');
            res.status(401).json({
                errors: {
                    common: { msg: 'Authentication failure!' },
                },
            });
        }
    } else {
        res.status(401).json({
            errors: {
                common: { msg: 'Authentication failure!' },
            },
        });
    }
});

// Export
module.exports = { authGuard };
