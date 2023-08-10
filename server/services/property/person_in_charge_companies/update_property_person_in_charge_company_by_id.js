const { PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const updatePropertyPersonInChargeCompanyById = async (id, newCompany) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeCompany", "id", [
      "id must be an integer",
      "id must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeCompany", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeCompany = await PropertyPersonInChargeCompany.findByPk(id);

  if (!personInChargeCompany) {
    const err = new ErrorDetails("PropertyPersonInChargeCompany", "id", "name not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    if (newCompany) {
      if (typeof newCompany !== "string") {
        const err = new ErrorDetails("PropertyPersonInChargeCompany", "name", "name must be string");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      personInChargeCompany.name = newCompany[0].toUpperCase() + newCompany.slice(1);
    }

    await personInChargeCompany.save();
  } catch (error) {
    throw error;
  }
}

module.exports = updatePropertyPersonInChargeCompanyById;
