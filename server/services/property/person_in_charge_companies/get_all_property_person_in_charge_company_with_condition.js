const { PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyPersonInChargeCompanyWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeCompanies = await PropertyPersonInChargeCompany.findOne({
    where,
    attributes: [
      'id',
      'name',
      'created_at',
      'updated_at',
    ],
  });

  if (!personInChargeCompanies) {
    const err = new ErrorDetails("PropertyPersonInChargeCompanyError", "person_in_charge_company", "person_in_charge_company not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return personInChargeCompanies;
}

module.exports = getAllPropertyPersonInChargeCompanyWithCondition;
