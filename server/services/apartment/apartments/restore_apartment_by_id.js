const Log = require("../../../models/log");

const { sequelize } = require("../../../utils/db");
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../../models/apartment");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const restoreApartmentById = async (req) => {
  if (!req.params.kode_propar) {
    const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  try {
    await sequelize.transaction(async (t) => {
      const apartment = await Apartment.findByPk(req.params.kode_propar, { paranoid: false });

      if (!apartment) {
        const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      await apartment.restore({ transaction: t });

      const facilities = await ApartmentFacility.findAll({
        where: { apartment_kode_propar: apartment.kode_propar },
        paranoid: false,
      });

      if (facilities) {
        facilities.forEach(async (facility) => await facility.restore({ transaction: t }));
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Apartment ${req.param.kode_propar} Facilities` });
      }

      const photos = await ApartmentPhoto.findAll({
        where: { apartment_kode_propar: apartment.kode_propar },
        paranoid: false,
      });

      if (photos) {
        photos.forEach(async (photo) => await photo.restore());
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Apartment ${req.param.kode_propar} Photos` });
      }
    });

    await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Apartment ${req.param.kode_propar}` }, {
      transaction: t,
    });
  } catch (error) {
    throw error
  }
}

module.exports = restoreApartmentById;
