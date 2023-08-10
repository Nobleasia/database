const { PropertyFacilityName } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyFacilityNameWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyFacilityNameError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyFacilityNames = await PropertyFacilityName.findOne({
    where,
    attributes: [
      'id',
      'facility_name',
      'created_at',
      'updated_at',
    ],
  });

  if (!propertyFacilityNames) {
    const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", "facility_name not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return propertyFacilityNames;
}

module.exports = getAllPropertyFacilityNameWithCondition;
