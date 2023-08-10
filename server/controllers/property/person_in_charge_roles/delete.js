const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { deletePropertyPersonInChargeRoleById } = require("../../../services/property/person_in_charge_roles");

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePropertyPersonInChargeRoleById(Number(req.params.id), req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_person_in_charge_roles", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
