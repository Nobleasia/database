const bcrypt = require("bcrypt");

const Log = require("../../models/log");
const { User } = require("../../models/user");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const updateExistingUserByUsername = async (req) => {
  if (req.params.username === "root") {
    const err = new ErrorDetails("UserError", "authorization", "can't update root");
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

  const { username, fullname, role, password } = req.body;

  if (!(username || fullname || role || password)) {
    const err = new ErrorDetails("UserError", "request body", "request body must not be empty");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  if (username) {
    if (typeof username !== "string") {
      const err = new ErrorDetails("UserError", "request body", "request body must not be empty");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    user.username = username;

    await Log.create({ status_code: 204, username: req.username ?? null, message: `Update User ${user.username} Username to ${username}` });
  }

  if (fullname) {
    if (typeof fullname !== "string") {
      const err = new ErrorDetails("UserError", "fullname", "fullname must be string");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    user.fullname = fullname;

    await Log.create({ status_code: 204, username: req.username ?? null, message: `Update User ${user.username} Fullname` });
  }

  if (role) {
    if (typeof role !== "string") {
      const err = new ErrorDetails("UserError", "role", "role must be string");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    if (!(role === "superadmin" && role === "admin" && role === "user")) {
      const err = new ErrorDetails("UserError", "role", "role value must be between `superadmin`, `admin`, or `user`");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    if ((role === "admin" || user.role === "admin") && req.role !== "superadmin") {
      const err = new ErrorDetails("UserError", "authorization", "you're not allowed to access this service");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if ((role === "superadmin" || user.role === "superadmin") && req.username !== "root") {
      const err = new ErrorDetails("UserError", "authorization", "you're not allowed to access this service");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    user.role = role;

    await Log.create({ status_code: 204, username: req.username ?? null, message: `Update User ${user.username} Role` });
  }

  if (password) {
    if (typeof password !== "string") {
      const err = new ErrorDetails("UserError", "password", "password must be string");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    if (password_hash === user.password_hash) {
      const err = new ErrorDetails("UserError", "password", "can't use the same password");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
    }

    user.password_hash = password_hash;

    await Log.create({ status_code: 204, username: req.username ?? null, message: `Update User ${user.username} Password` });
  }

  user.save();
}

module.exports = updateExistingUserByUsername;
