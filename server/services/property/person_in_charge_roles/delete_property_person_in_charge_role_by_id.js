const fs = require("fs");
const { sequelize } = require("../../../utils/db");
const { PropertyPersonInChargeRole, PropertyPersonInCharge } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");
const { Apartment, ApartmentFacility, ApartmentPhoto } = require("../../../models/apartment");

const deletePropertyPersonInChargeRoleById = async (id, req) => {
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

  const personInChargeRole = await PropertyPersonInChargeRole.findByPk(id, {
    paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
  });

  if (!personInChargeRole) {
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", "role not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    await sequelize.transaction(async (t) => {
      // delete all apartments and person in charges
      const pics = await PropertyPersonInCharge.findAll({
        where: {
          property_person_in_charge_role_id: personInChargeRole.id,
        },
        transaction: t,
        paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
      });

      if (Array.isArray(pics) && pics.length != 0) {
        for (const pic of pics) {
          const apartments = await Apartment.findAll({
            where: {
              property_person_in_charge_id: pic.id,
            },
            transaction: t,
          });

          if (Array.isArray(apartments) && apartments.length != 0) {
            for (const apartment of apartments) {
              await ApartmentFacility.destroy({
                where: {
                  apartment_kode_propar: apartment.kode_propar,
                },
                transaction: t,
                force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
              });

              const photos = await ApartmentPhoto.findAll({
                where: {
                  apartment_kode_propar: apartment.kode_propar
                },
                paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
              });

              if (photos) {
                if (typeof (req.query.force) === "string" ? req.query.force === "true" : false) {
                  const path = photos.map(photo => {
                    return photo.photo_path
                  });

                  path.forEach(filepath => fs.unlink(filepath, (err) => {
                    if (err) throw err;
                  }));
                }

                photos.forEach(async (photo) => {
                  await photo.destroy({
                    transaction: t,
                    force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
                  });
                });
              }

              await apartment.destroy({
                transaction: t,
                force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
              });
            }
          }

          await pic.destroy({
            transaction: t,
            force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
          });
        }
      }

      await personInChargeRole.destroy({
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });
    });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInChargeRoleError", "role", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = deletePropertyPersonInChargeRoleById;
