const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyPersonInChargeCompany } = require("../../../services/property/person_in_charge_companies");

router.post("/", async (req, res, next) => {
  try {
    await createNewPropertyPersonInChargeCompany(req.body.name);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_person_in_charge_companies", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
