const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getAllLandKodePropar } = require("../../services/lands");

router.get("/", async (req, res, next) => {
  try {

    const lands = await getAllLandKodePropar(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("lands", lands));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
