const fs = require("fs");
const { sequelize } = require("../../../utils/db");
const { PropertyPersonInCharge } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");
const { Apartment, ApartmentFacility, ApartmentPhoto } = require("../../../models/apartment");

const deletePropertyPersonInChargeById = async (id, req) => {
  if (isNaN(id)) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "id", "id must be an integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (id <= 0) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "id", "id must be more than zero");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const personInCharge = await PropertyPersonInCharge.findByPk(id);

  if (!personInCharge) {
    const err = new ErrorDetails("PropertyPersonInChargeError", "person_in_charge", "person_in_charge not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  try {
    await sequelize.transaction(async (t) => {
      // delete all apartments
      const apartments = await Apartment.findAll({
        where: {
          property_person_in_charge_id: personInCharge.id,
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
            force: req.query.force === "true",
          });

          const photos = await ApartmentPhoto.findAll({ where: { apartment_kode_propar: apartment.kode_propar } });

          console.log(photos);

          if (photos) {
            if (req.query.force === "true") {
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
                force: req.query.force === "true",
              });
            });
          }

          await apartment.destroy({
            transaction: t,
            force: req.query.force === "true",
          });
        }
      }

      await personInCharge.destroy({
        transaction: t,
        force: req.query.force === "true",
      });
    });
  } catch (error) {
    // TODO: ganti console ke log kalau sudah mau production
    console.error(error);
    const err = new ErrorDetails("PropertyPersonInChargeError", "person_in_charge", error.errors[0].message);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
}

module.exports = deletePropertyPersonInChargeById;
