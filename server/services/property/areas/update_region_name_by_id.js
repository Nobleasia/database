const { PropertyArea } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const updateRegionNameById = async (id, newRegionName) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyAreaError", "id", [
      "id must be an integer",
      "id must not be null",
    ]);
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

  if (typeof newRegionName !== "string") {
    const err = new ErrorDetails("PropertyAreaError", "region_name", [
      "region_name must be string",
      "region_name must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (!newRegionName) {
    const err = new ErrorDetails("PropertyAreaError", "region_name", "region_name must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyArea = await PropertyArea.findByPk(id);

  if (!propertyArea) {
    const err = new ErrorDetails("PropertyAreaError", "id", "property area not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    propertyArea.region_name = newRegionName[0].toUpperCase() + newRegionName.slice(1);
    await propertyArea.save();
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyAreaError", "region_name", error.message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = updateRegionNameById;
