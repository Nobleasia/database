const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyPersonInCharge } = require("../../../services/property/person_in_charges");

router.post("/", async (req, res, next) => {
  const { fullname, role, company, phone_number } = req.body;

  try {
    await createNewPropertyPersonInCharge(fullname, role, company, phone_number);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_person_in_charges", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
