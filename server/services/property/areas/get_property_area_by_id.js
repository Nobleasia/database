const { PropertyArea } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getPropertyAreaById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyAreaError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyAreaError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyArea = await PropertyArea.findByPk(id, {
    attributes: [
      'id',
      'region_name',
      'created_at',
      'updated_at',
    ],
  });
  if (!propertyArea) {
    const err = new ErrorDetails("PropertyAreaError", "region_name", "region not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return propertyArea;
}

module.exports = getPropertyAreaById;
