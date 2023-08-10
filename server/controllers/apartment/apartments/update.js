const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { generateMulter } = require("../../../services/utilities");
const { updateOrCreateApartmentById } = require("../../../services/apartment/apartments");

const upload = generateMulter("apartment");

router.put("/:kode_propar", upload.array("images"), async (req, res, next) => {
  try {
    await updateOrCreateApartmentById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("apartments", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
