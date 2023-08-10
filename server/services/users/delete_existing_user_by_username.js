const Log = require("../../models/log");

const { User } = require("../../models/user");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const deleteExistingUserByUsername = async (req) => {
  if (req.params.username === "root") {
    const err = new ErrorDetails("UserError", "authorization", "can't delete root");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const user = await User.findOne({ where: { username: req.params.username } });

  if (!user) {
    const err = new ErrorDetails("UserError", "username", "username not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  if (user.role === "superadmin" && req.username !== "root") {
    const err = new ErrorDetails("UserError", "authorization", "you're not allowed to access this service");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (user.role === "admin" && req.role !== "superadmin") {
    const err = new ErrorDetails("UserError", "authorization", "you're not allowed to access this service");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  await user.destroy({ force: typeof (req.query.force) === "string" ? req.query.force === "true" : false });

  await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete User ${user.username}` });
}

module.exports = deleteExistingUserByUsername;
