const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllApartments } = require("../../../services/apartment/apartments");

router.get("/", async (req, res, next) => {
  try {

    const apartments = await getAllApartments(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("apartments", apartments));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
