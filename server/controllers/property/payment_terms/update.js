const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updatePaymentTermById } = require("../../../services/property/payment_terms");

router.put("/:id", async (req, res, next) => {
  try {
    await updatePaymentTermById(Number(req.params.id), req.body.new_payment_term);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_payment_terms", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
