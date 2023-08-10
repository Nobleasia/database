const { PropertyPersonInCharge, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getPropertyPersonInChargeById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInCharge = await PropertyPersonInCharge.findByPk(id, {
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
  if (!personInCharge) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "person_in_charge", "person_in_charge not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return personInCharge;
}

module.exports = getPropertyPersonInChargeById;
