const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updatePropertyPersonInChargeRoleById } = require("../../../services/property/person_in_charge_roles");

router.put("/:id", async (req, res, next) => {
  try {
    await updatePropertyPersonInChargeRoleById(Number(req.params.id), req.body.new_name);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_person_in_charge_roles", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
