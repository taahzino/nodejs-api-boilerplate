// @desc GET user data
// @route GET /api/users/me
// @access Private
const getUser = async (req, res) => {
  return res.json(res.locals.user);
};

module.exports = getUser;
