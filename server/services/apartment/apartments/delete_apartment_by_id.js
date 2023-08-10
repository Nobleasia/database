const fs = require("fs");
const Log = require("../../../models/log");
const { sequelize } = require("../../../utils/db");
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../../models/apartment");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const deleteApartmentById = async (req, res) => {
  if (!req.params.kode_propar) {
    const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
  try {
    await sequelize.transaction(async (t) => {
      const apartment = await Apartment.findByPk(req.params.kode_propar, {
        paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
      });

      if (!apartment) {
        const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      const facilities = await ApartmentFacility.findAll({
        where: {
          apartment_kode_propar: apartment.kode_propar
        },
        paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
      });

      if (facilities) {
        facilities.forEach(async (facility) => {
          await facility.destroy({
            transaction: t,
            force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
          });
        });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Apartment ${req.params.kode_propar} Facilities are DELETED` }, {
          transaction: t,
        });
      }

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

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Apartment ${req.params.kode_propar} Photos are DELETED` }, {
          transaction: t,
        });
      }

      await apartment.save({ transaction: t });

      await apartment.destroy({
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Apartment ${req.params.kode_propar} is DELETED` }, {
        transaction: t,
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = deleteApartmentById;
