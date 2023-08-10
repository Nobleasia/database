const { PropertyPersonInChargeRole } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const updatePropertyPersonInChargeRoleById = async (id, newRole) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeRole", "id", [
      "id must be an integer",
      "id must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeRole", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeRole = await PropertyPersonInChargeRole.findByPk(id);

  if (!personInChargeRole) {
    const err = new ErrorDetails("PropertyPersonInChargeRole", "id", "name not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    if (newRole) {
      if (typeof newRole !== "string") {
        const err = new ErrorDetails("PropertyPersonInChargeRole", "name", "name must be string");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      personInChargeRole.name = newRole[0].toUpperCase() + newRole.slice(1);
    }

    await personInChargeRole.save();
  } catch (error) {
    throw error;
  }
}

module.exports = updatePropertyPersonInChargeRoleById;
