const jwt = require('jsonwebtoken');

const { ErrorResponse, ErrorDetails } = require("../models/response");
const {
  ACCESS_TOKEN_SECRET,
  TOKEN_ALGORITHM,
  TOKEN_ISSUER,
  TOKEN_AUDIENCE,
} = require("../utils/config");

const getUsername = (req, res, next) => {
  const authorizationHeader = req.header('authorization');
  if (!authorizationHeader) {
    const err = new ErrorDetails("AccessTokenError", "access_token", "access token is wrong");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    const err = new ErrorDetails("AccessTokenError", "access_token", "access token is missing");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
  }

  const accessToken = parts[1];

  try {
    const { username } = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      algorithm: TOKEN_ALGORITHM,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });

    req.username = username;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const err = new ErrorDetails("AccessTokenError", "access_token", "access token has expired");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
    }
    const err = new ErrorDetails("AccessTokenError", "access_token", error.message);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
  }
}

module.exports = getUsername;
