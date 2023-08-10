const { PropertyPaymentTerm } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const updatePaymentTermById = async (id, newPaymentTerm) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPaymentTermError", "id", [
      "id must be an integer",
      "id must not be null",
    ]);
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

  if (typeof newPaymentTerm !== "string") {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", [
      "payment_term must be string",
      "payment_term must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (!newPaymentTerm) {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", "payment_term must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const paymentTerm = await PropertyPaymentTerm.findByPk(id);

  if (!paymentTerm) {
    const err = new ErrorDetails("PropertyPaymentTermError", "id", "payment_term not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    paymentTerm.payment_term = newPaymentTerm[0].toUpperCase() + newPaymentTerm.slice(1);
    await paymentTerm.save();
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", error.message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = updatePaymentTermById;
