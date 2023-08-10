const { sequelize } = require("../../../utils/db");
const { PropertyFacilityName } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");
const { ApartmentFacility } = require("../../../models/apartment");

const deletePropertyFacilityNameById = async (id, req) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyFacilityNameError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyFacilityNameError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const propertyFacilityName = await PropertyFacilityName.findByPk(id, {
    paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
  });

  if (!propertyFacilityName) {
    const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", "facility_name not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    await sequelize.transaction(async (t) => {
      // delete all apartment facilities
      await ApartmentFacility.destroy({
        where: {
          property_facility_name_id: propertyFacilityName.id,
        },
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });

      await propertyFacilityName.destroy({
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });
    });

  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyFacilityNameError", "facility_name", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = deletePropertyFacilityNameById;
