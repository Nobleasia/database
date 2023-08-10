const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getAllOfficeKodePropar } = require("../../services/offices");

router.get("/", async (req, res, next) => {
  try {

    const offices = await getAllOfficeKodePropar(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("offices", offices));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
