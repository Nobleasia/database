const { PropertyPersonInCharge, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");
const { sequelize } = require("../../../utils/db");

const updatePropertyPersonInChargeById = async (id, newFullname, newRole, newCompany, newPhoneNumber) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInCharge", "id", [
      "id must be an integer",
      "id must not be null",
    ]);
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInCharge", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyPersonInCharge = await PropertyPersonInCharge.findByPk(id);

  if (!propertyPersonInCharge) {
    const err = new ErrorDetails("PropertyPersonInCharge", "id", "person_in_charge not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    await sequelize.transaction(async (t) => {
      if (newFullname) {
        if (typeof newFullname !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "new_fullname", "new_fullname must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        propertyPersonInCharge.fullname = newFullname[0].toUpperCase() + newFullname.slice(1);
      }

      if (newRole) {
        if (typeof newRole !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "new_role", "new_role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        const role = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: newRole },
          defaults: { name: newRole },
          transaction: t,
        });

        propertyPersonInCharge.property_person_in_charge_role_id = role[0].id;
      }

      if (newCompany) {
        if (typeof newCompany !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "new_company", "new_company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        const company = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: newCompany },
          defaults: { name: newCompany },
          transaction: t,
        });

        propertyPersonInCharge.property_person_in_charge_company_id = company[0].id;
      }

      if (newPhoneNumber) {
        if (typeof newPhoneNumber !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "new_phone_number", "new_phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        propertyPersonInCharge.phoneNumber = newPhoneNumber;
      }

      await propertyPersonInCharge.save({ transaction: t });
    });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInCharge", "person_in_charge", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = updatePropertyPersonInChargeById;
