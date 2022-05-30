const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");

const verifyToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const doc = await User.findById(decoded._id);

  const user = lodash.cloneDeep(doc.toObject());

  user.password = undefined;

  return user;
};

module.exports = verifyToken;
