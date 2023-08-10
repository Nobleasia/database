const { PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const restorePropertyPersonInChargeCompanyById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeCompany = await PropertyPersonInChargeCompany.findByPk(id, { paranoid: false });

  if (!personInChargeCompany) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "role", "role not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  if (!personInChargeCompany.deletedAt) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "role", "role is not deleted");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  try {
    await personInChargeCompany.restore();
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "role", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = restorePropertyPersonInChargeCompanyById;
