const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { restorePropertyPersonInChargeById } = require("../../../services/property/person_in_charges");

router.put("/:id", async (req, res, next) => {
  try {
    await restorePropertyPersonInChargeById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charges", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
