const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyFacilityName } = require("../../../services/property/facility_names");

router.post("/", async (req, res, next) => {
  try {
    await createNewPropertyFacilityName(req.body.facility_name);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_facility_names", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
