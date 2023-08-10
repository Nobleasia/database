const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updatePropertyPersonInChargeById } = require("../../../services/property/person_in_charges");

router.put("/:id", async (req, res, next) => {
  try {
    await updatePropertyPersonInChargeById(Number(req.params.id), req.body.new_fullname, req.body.new_role, req.body.new_company, req.body.new_phone_number);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_person_in_charges", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
