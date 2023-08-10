const fs = require("fs");
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { Land, LandPhoto } = require("../../models/land");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const deleteLandById = async (req) => {
  if (!req.params.kode_propar) {
    const err = new ErrorDetails("LandError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }
  try {
    await sequelize.transaction(async (t) => {
      const land = await Land.findByPk(req.params.kode_propar, {
        paranoid: !(typeof (req.query.force) === "string" ? req.query.force === "true" : false),
      });

      if (!land) {
        const err = new ErrorDetails("LandError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      const photos = await LandPhoto.findAll({
        where: {
          land_kode_propar: land.kode_propar
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

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Land ${req.params.kode_propar} Photos are DELETED` }, {
          transaction: t,
        });
      }

      await land.save({ transaction: t });

      await land.destroy({
        transaction: t,
        force: typeof (req.query.force) === "string" ? req.query.force === "true" : false,
      });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Land ${req.params.kode_propar} is DELETED` }, {
        transaction: t,
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = deleteLandById;
