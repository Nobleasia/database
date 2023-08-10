const router = require('express').Router();
const { SuccessResponse, DataDetails } = require('../../models/response');
const { login } = require("../../services/users");
const { COOKIE_MAX_AGE } = require("../../utils/config");

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { newAccessToken, newRefreshToken, userRole } = await login(username, password);

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      // sameSite: 'strict',
      secure: true,
      //TODO: Ganti ke 1 hari kalau deployment
      maxAge: parseInt(COOKIE_MAX_AGE, 10),
    });

    const response = new SuccessResponse(200, "OK", new DataDetails("bearer_token", {
      "user_role": userRole,
      "access_token": newAccessToken,
    }));

    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;