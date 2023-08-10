const { PropertyPaymentTerm } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyPaymentTermWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyPaymentTermError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const paymentTerms = await PropertyPaymentTerm.findOne({
    where,
    attributes: [
      'id',
      'payment_term',
      'created_at',
      'updated_at',
    ],
  });

  if (!paymentTerms) {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", "payment_term not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return paymentTerms;
}

module.exports = getAllPropertyPaymentTermWithCondition;
