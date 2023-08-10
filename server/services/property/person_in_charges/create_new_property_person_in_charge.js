const { PropertyPersonInCharge, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");
const { sequelize } = require("../../../utils/db");

const createNewPropertyPersonInCharge = async (fullname, role, company, phone_number) => {
  try {
    await sequelize.transaction(async (t) => {
      let company_id, role_id;

      if (!fullname) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (typeof fullname !== "string") {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must be string");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (!phone_number) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (typeof phone_number !== "string") {
        const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (role) {
        if (typeof role !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        role_id = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: role },
          defaults: { name: role },
          transaction: t,
        });
      }

      if (company) {
        if (typeof company !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "company", "company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        company_id = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: company },
          defaults: { name: company },
          transaction: t,
        });
      }

      await PropertyPersonInCharge.create({
        fullname: fullname,
        property_person_in_charge_role_id: role_id && typeof role_id[0].id === "number" ? role_id[0].id : null,
        property_person_in_charge_company_id: company_id && typeof company_id[0].id === "number" ? company_id[0].id : null,
        phone_number: phone_number,
      },
        { transaction: t });
    });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInChargeError", "property_person_in_charges", error.message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = createNewPropertyPersonInCharge;
