const { ErrorResponse } = require("../models/response");
const Log = require("../models/log");

const errorHandler = async (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    console.log(err.errors);
    const values = Object.values(err.errors);
    const value = values[0];
    await Log.create({ status_code: err.code, username: req.username ?? null, message: value });

    res.status(err.code).json(err);
    return;
  }
  // TODO: ganti console ke log kalau sudah mau production
  console.error(err);

  await Log.create({ status_code: 500, username: req.username ?? null, message: "Internal Server Error" });

  res.status(500).json({
    name: err.name,
    message: "Internal Server Error"
  });
}

module.exports = errorHandler;
