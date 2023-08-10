const router = require("express").Router();
const { Op } = require('sequelize');
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllPropertyPaymentTermWithCondition, getAllPropertyPaymentTerm, getPropertyPaymentTermById, } = require("../../../services/property/payment_terms");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.payment_term) {
      where.payment_term = {
        [Op.substring]: req.query.payment_term,
      };
    }

    if (Object.keys(where).length === 0) {
      const paymentTerms = await getAllPropertyPaymentTerm();

      const response = new SuccessResponse(200, "OK", new DataDetails("property_payment_terms", paymentTerms));
      res.status(response.code).json(response);
      return;
    }

    const paymentTerms = await getAllPropertyPaymentTermWithCondition(where);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_payment_terms", paymentTerms));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const paymentTerm = await getPropertyPaymentTermById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_payment_terms", paymentTerm));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
