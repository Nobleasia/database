const { PropertyPersonInChargeRole } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const createNewPropertyPersonInChargeRole = async (picRole) => {
  try {
    if (!picRole) {
      const err = new ErrorDetails("PropertyPersonInChargeRoleError", "name", "PIC role name must not be blank");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (typeof picRole !== "string") {
      const err = new ErrorDetails("PropertyPersonInChargeRoleError", "name", [
        "PIC role name must be a string",
        "PIC role name must not be null",
      ]);
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    await PropertyPersonInChargeRole.create({
      name: picRole[0].toUpperCase() + picRole.slice(1),
    });
  } catch (error) {
    throw error;
  }
}

module.exports = createNewPropertyPersonInChargeRole;
