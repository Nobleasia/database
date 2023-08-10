const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getLogsData } = require("../../services/utilities");

router.get("/", async (req, res, next) => {
  try {

    const logs = await getLogsData(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("logs", logs));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
