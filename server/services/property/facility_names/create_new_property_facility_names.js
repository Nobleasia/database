const { PropertyFacilityName } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const createNewPropertyFacilityName = async (facilityName) => {
  try {
    if (!facilityName) {
      const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", "facility_name must not be blank");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (typeof facilityName !== "string") {
      const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", [
        "facility_name must be a string",
        "facility_name must not be null",
      ]);
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    await PropertyFacilityName.create({
      facility_name: facilityName[0].toUpperCase() + facilityName.slice(1),
    });
  } catch (error) {
    throw error;
  }
}

module.exports = createNewPropertyFacilityName;
