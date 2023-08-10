const { PropertyFacilityName } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getPropertyFacilityNameById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyFacilityNameError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyFacilityNameError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyFacilityName = await PropertyFacilityName.findByPk(id, {
    attributes: [
      'id',
      'facility_name',
      'created_at',
      'updated_at',
    ],
  });
  if (!propertyFacilityName) {
    const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", "facility_name not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return propertyFacilityName;
}

module.exports = getPropertyFacilityNameById;
