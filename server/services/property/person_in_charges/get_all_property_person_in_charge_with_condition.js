const { PropertyPersonInCharge, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyPersonInChargeWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInCharges = await PropertyPersonInCharge.findOne({
    where,
    attributes: [
      "id",
      "fullname",
      "phone_number",
      'created_at',
      'updated_at',
    ],
    include: [
      {
        model: PropertyPersonInChargeCompany,
        as: "property_person_in_charge_company",
        attributes: ["id", "name"],
      },
      {
        model: PropertyPersonInChargeRole,
        as: "property_person_in_charge_role",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!personInCharges) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "person_in_charge", "person_in_charge not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return personInCharges;
}

module.exports = getAllPropertyPersonInChargeWithCondition;
