const router = require('express').Router();
const { SuccessResponse, DataDetails } = require('../../models/response');
const { ErrorResponse, ErrorDetails } = require("../../models/response");
const logout = require('../../services/users/logout');

router.get("/", async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      const err = new ErrorDetails("BlacklistTokenError", "refresh_token", "refresh token is missing");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    const refreshToken = cookies.jwt

    await logout(refreshToken);

    res.removeHeader("Authorization");
    res.clearCookie('jwt');

    const response = new SuccessResponse(200, "OK", new DataDetails("logout", null));

    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
