const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { deleteApartmentById } = require("../../../services/apartment/apartments");

router.delete("/:kode_propar", async (req, res, next) => {
  try {
    await deleteApartmentById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("apartments", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
