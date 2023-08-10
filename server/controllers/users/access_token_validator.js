const router = require('express').Router();
const { SuccessResponse, DataDetails } = require('../../models/response');
const { accessTokenValidator } = require('../../middleware');

router.get('/', accessTokenValidator, async (req, res) => {
  const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("access_token", null));

  res.status(response.code).json(response);
});

module.exports = router;
