const { PropertyPaymentTerm } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getPropertyPaymentTermById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPaymentTermError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPaymentTermError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const paymentTerm = await PropertyPaymentTerm.findByPk(id, {
    attributes: [
      'id',
      'payment_term',
      'created_at',
      'updated_at',
    ],
  });
  if (!paymentTerm) {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", "payment_term not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return paymentTerm;
}

module.exports = getPropertyPaymentTermById;