const { PropertyPaymentTerm } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const createNewPropertyPaymentTerm = async (paymentTerm) => {
  if (typeof paymentTerm !== "string") {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", [
      "payment_term must be a string",
      "payment_term must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (!paymentTerm) {
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", "payment_term must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  try {
    await PropertyPaymentTerm.create({ payment_term: paymentTerm[0].toUpperCase() + paymentTerm.slice(1) });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPaymentTermError", "payment_term", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = createNewPropertyPaymentTerm;
