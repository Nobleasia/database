const { PropertyPersonInChargeRole } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyPersonInChargeRoleWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeRoles = await PropertyPersonInChargeRole.findOne({
    where,
    attributes: [
      'id',
      'name',
      'created_at',
      'updated_at',
    ],
  });

  if (!personInChargeRoles) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", "role not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return personInChargeRoles;
}

module.exports = getAllPropertyPersonInChargeRoleWithCondition;
