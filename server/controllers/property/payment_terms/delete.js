const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { deletePropertyPaymentTermById } = require("../../../services/property/payment_terms");

router.delete("/:id", async (req, res, next) => {
  try {
    await deletePropertyPaymentTermById(Number(req.params.id), req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_payment_terms", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
