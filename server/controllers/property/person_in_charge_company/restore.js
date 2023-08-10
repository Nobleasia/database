const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { restorePropertyPersonInChargeCompanyById } = require("../../../services/property/person_in_charge_companies");

router.put("/:id", async (req, res, next) => {
  try {
    await restorePropertyPersonInChargeCompanyById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_companies", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
