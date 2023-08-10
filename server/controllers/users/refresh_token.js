const router = require('express').Router();
const { refreshTokenValidator } = require("../../services/users");

const { SuccessResponse, DataDetails, ErrorResponse, ErrorDetails } = require("../../models/response");

router.get("/", async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!(cookies?.jwt || cookies?.['next-auth.session-token'])) {
      const err = new ErrorDetails("BlacklistTokenError", "refresh_token", "refresh token is missing");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(401, "UNAUTHORIZED", { [err.attribute]: err.message });
    }
    const refreshToken = cookies.jwt ? cookies.jwt : cookies['next-auth.session-token'] ? cookies['next-auth.session-token'] : undefined;
    const { newAccessToken, userRole } = await refreshTokenValidator(refreshToken);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("access_token", {
      "user_role": userRole,
      "new_access_token": newAccessToken,
    }));
    res.status(201).json(response);
  } catch (error) {
    res.clearCookie('jwt');
    res.clearCookie('next-auth.session-token');
    next(error);
  }
});

module.exports = router;