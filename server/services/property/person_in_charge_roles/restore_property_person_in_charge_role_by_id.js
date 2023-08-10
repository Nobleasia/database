const { PropertyPersonInChargeRole } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const restorePropertyPersonInChargeRoleById = async (id) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInChargeRole = await PropertyPersonInChargeRole.findByPk(id, { paranoid: false });

  if (!personInChargeRole) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", "role not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  if (!personInChargeRole.deletedAt) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", "role is not deleted");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  try {
    await personInChargeRole.restore();
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = restorePropertyPersonInChargeRoleById;
