const fs = require("fs");
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { Office, OfficePhoto, OfficeFacility } = require("../../models/office");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const deleteOfficeById = async (req) => {
  if (!req.params.kode_propar) {
    const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
  try {
    await sequelize.transaction(async (t) => {
      const office = await Office.findByPk(req.params.kode_propar, {
        paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
      });

      if (!office) {
        const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      const facilities = await OfficeFacility.findAll({
        where: {
          office_kode_propar: office.kode_propar
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

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Office ${req.params.kode_propar} Facilities are DELETED` }, {
          transaction: t,
        });
      }

      const photos = await OfficePhoto.findAll({
        where: {
          office_kode_propar: office.kode_propar
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

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Office ${req.params.kode_propar} Photos are DELETED` }, {
          transaction: t,
        });
      }

      await office.save({ transaction: t });

      await office.destroy({
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Office ${req.params.kode_propar} is DELETED` }, {
        transaction: t,
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = deleteOfficeById;
