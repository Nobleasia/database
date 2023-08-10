const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyPersonInChargeRole } = require("../../../services/property/person_in_charge_roles");

router.post("/", async (req, res, next) => {
  try {
    await createNewPropertyPersonInChargeRole(req.body.name);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_person_in_charge_roles", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
