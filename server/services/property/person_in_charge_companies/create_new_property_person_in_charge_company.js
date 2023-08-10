const { PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const createNewPropertyPersonInChargeCompany = async (picCompany) => {
  try {
    if (!picCompany) {
      const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "name", "PIC role name must not be blank");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (typeof picCompany !== "string") {
      const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "name", [
        "PIC role name must be a string",
        "PIC role name must not be null",
      ]);
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    await PropertyPersonInChargeCompany.create({
      name: picCompany[0].toUpperCase() + picCompany.slice(1),
    });
  } catch (error) {
    throw error;
  }
}

module.exports = createNewPropertyPersonInChargeCompany;
