const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { generateMulter } = require("../../../services/utilities");
const { createNewApartment } = require("../../../services/apartment/apartments");

const upload = generateMulter("apartment");

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    await createNewApartment(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("apartments", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
