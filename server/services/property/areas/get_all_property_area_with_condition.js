const { PropertyArea } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllPropertyAreaWithCondition = async (where) => {
  if (typeof where !== "object" || Array.isArray(where) || where === null || Object.keys(where).length === 0) {
    const err = new ErrorDetails("PropertyAreaError", "where", [
      "condition must be an object",
      "condition must not be null"
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyAreas = await PropertyArea.findOne({
    where,
    attributes: [
      'id',
      'region_name',
      'created_at',
      'updated_at',
    ],
  });

  if (!propertyAreas) {
    const err = new ErrorDetails("PropertyAreaError", "region_name", "region not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return propertyAreas;
}

module.exports = getAllPropertyAreaWithCondition;
