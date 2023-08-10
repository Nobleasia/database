const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { deletePropertyPersonInChargeById } = require("../../../services/property/person_in_charges");

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePropertyPersonInChargeById(Number(req.params.id), req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_person_in_charges", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
