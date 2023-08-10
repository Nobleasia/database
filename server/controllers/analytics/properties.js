const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getPropertyAnalytics } = require("../../services/utilities");

router.get("/", async (req, res, next) => {
  try {

    const analytics = await getPropertyAnalytics();

    const response = new SuccessResponse(200, "OK", new DataDetails("analytics", analytics));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
