const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updatePropertyPersonInChargeCompanyById } = require("../../../services/property/person_in_charge_companies");

router.put("/:id", async (req, res, next) => {
  try {
    await updatePropertyPersonInChargeCompanyById(Number(req.params.id), req.body.new_name);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_person_in_charge_companies", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
