const { ErrorResponse, ErrorDetails } = require("../models/response");
const { User } = require("../models/user");

const adminValidator = async (req, res, next) => {
  if (!req.username) {
    const err = new ErrorDetails("AdminValidatorError", "authorization", "you're not allowed to access this service");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
  }

  const admin = await User.findOne({ where: { username: req.username } });

  if (admin.role === "user") {
    const err = new ErrorDetails("UserError", "authorization", "you're not allowed to access this service");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  req.role = admin.role;

  next();
}

module.exports = adminValidator;