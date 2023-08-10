const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updateFacilityNameById } = require("../../../services/property/facility_names");

router.put("/:id", async (req, res, next) => {
  try {
    await updateFacilityNameById(Number(req.params.id), req.body.new_facility_name);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_facility_names", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
