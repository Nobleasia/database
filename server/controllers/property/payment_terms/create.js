const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyPaymentTerm } = require("../../../services/property/payment_terms");

router.post("/", async (req, res, next) => {
  const { payment_term } = req.body;

  try {
    await createNewPropertyPaymentTerm(payment_term);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_payment_terms", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
