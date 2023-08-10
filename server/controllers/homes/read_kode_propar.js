const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getAllHomeKodePropar } = require("../../services/homes");

router.get("/", async (req, res, next) => {
  try {

    const homes = await getAllHomeKodePropar(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("homes", homes));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
