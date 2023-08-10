const { PropertyArea } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const createNewPropertyArea = async (regionName) => {
  if (typeof regionName !== "string") {
    const err = new ErrorDetails("PropertyAreaError", "region_name", [
      "region_name must be a string",
      "region_name must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (!regionName) {
    const err = new ErrorDetails("PropertyAreaError", "region_name", "region_name must not be blank");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  try {
    await PropertyArea.create({ region_name: regionName[0].toUpperCase() + regionName.slice(1) });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyAreaError", "region_name", error.message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = createNewPropertyArea;
