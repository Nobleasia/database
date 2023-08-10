const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { deletePropertyFacilityNameById } = require("../../../services/property/facility_names");

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePropertyFacilityNameById(Number(req.params.id), req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_facility_names", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
