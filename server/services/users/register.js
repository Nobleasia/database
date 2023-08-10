const bcrypt = require("bcrypt");

const Log = require("../../models/log");
const { ErrorResponse, ErrorDetails } = require("../../models/response");
const { User } = require("../../models/user");

const register = async (username, fullname, role, password, admin) => {
  if (!username) {
    const err = new ErrorDetails("RegisterError", "username", "username must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(500, "INTERNAL_SERVER_ERROR", { [err.attribute]: err.message });
  }

  if (!fullname) {
    const err = new ErrorDetails("RegisterError", "fullname", "fullname must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(500, "INTERNAL_SERVER_ERROR", { [err.attribute]: err.message });
  }

  if (!role) {
    const err = new ErrorDetails("RegisterError", "role", "role must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(500, "INTERNAL_SERVER_ERROR", { [err.attribute]: err.message });
  }

  if (!password) {
    const err = new ErrorDetails("RegisterError", "password", "password must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(500, "INTERNAL_SERVER_ERROR", { [err.attribute]: err.message });
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  try {
    await User.create({ username, fullname, role, password_hash });

    await Log.create({ status_code: 200, username: admin ?? null, message: `Create new User ${username}` });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);

    const err = {};
    if (error.name === "SequelizeUniqueConstraintError") {
      err.username = "username has been taken";
      throw new ErrorResponse(400, "BAD_REQUEST", err);
    }

    if (error.name === "SequelizeDatabaseError") {
      err.role = "role must be between (superadmin)/(admin)/(user)";
      throw new ErrorResponse(400, "BAD_REQUEST", err);
    }
  }

  return;
}

module.exports = register;
