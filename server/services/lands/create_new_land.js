const fs = require('fs');
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { Land, LandPhoto } = require("../../models/land");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const { PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../models/property');

const createNewLand = async (req) => {
  const { fees, pic, ...land } = req.body;

  const landFees = fees ? JSON.parse(fees) : null;
  const landPic = pic ? JSON.parse(pic) : null;

  try {
    await sequelize.transaction(async (t) => {
      if (!land.kode_propar) {
        const err = new ErrorDetails("LandError", "kode_propar", "kode_propar must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      let pattern = /^[A-Z]{1,7}[0-9]{3}$/;

      if (!pattern.test(land.kode_propar)) {
        const err = new ErrorDetails("LandError", "kode_propar", [
          "total character must not be more than 10",
          "last 3 characters of kode_propar must be digits",
          "the rest of the characters must be capitalized letter",
        ]);

        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const where = {};

      if (!landPic.fullname) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      where.fullname = landPic.fullname;

      if (landPic.role) {
        if (typeof landPic.role !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!landPic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof landPic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        landPic.role_id = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: landPic.role },
          defaults: { name: landPic.role },
          transaction: t,
        });

        where.property_person_in_charge_role_id = landPic.role_id[0].id;
        where.phone_number = landPic.phone_number;

        if (landPic.role_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Role ${landPic.role} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Role ${landPic.role} data` }, {
            transaction: t,
          });
        }
      }

      if (landPic.company) {
        if (typeof landPic.company !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "company", "company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!landPic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof landPic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        landPic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: landPic.company },
          defaults: { name: landPic.company },
          transaction: t,
        });

        where.property_person_in_charge_company_id = landPic.company_id[0].id;
        where.phone_number = landPic.phone_number;

        if (landPic.company_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Company ${landPic.company} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Company ${landPic.company} data` }, {
            transaction: t,
          });
        }
      }

      const existingPIC = await PropertyPersonInCharge.findOrCreate({
        where,
        defaults: where,
        transaction: t,
      });

      land.pic_id = existingPIC[0].id;

      if (existingPIC[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${landPic.fullname} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${landPic.fullname} data` }, {
          transaction: t,
        });
      }

      if (!land.property_area) {
        const err = new ErrorDetails("LandError", "property_area", "property_area must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const area = await PropertyArea.findOrCreate({
        where: { region_name: land.property_area },
        defaults: { region_name: land.property_area },
        transaction: t,
      });

      if (!area) {
        const err = new ErrorDetails("LandError", "property_area", "property_area invalid region_name");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      land.property_area_id = area[0].id;

      if (area[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${land.property_area} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${land.property_area} data` }, {
          transaction: t,
        });
      }

      if (land.land_size) {
        land.land_size = Number(land.land_size);

        if (typeof land.land_size !== "number") {
          const err = new ErrorDetails("LandError", "land_size", "land_size must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (landFees.property_payment_terms_name) {
        const pt = await PropertyPaymentTerm.findOrCreate({
          where: { payment_term: landFees.property_payment_terms_name },
          defaults: { payment_term: landFees.property_payment_terms_name },
          transaction: t,
        });

        landFees.property_payment_term_id = pt[0].id;

        if (pt[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Payment Term ${landFees.property_payment_terms_name} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Payment Term ${landFees.property_payment_terms_name} data` }, {
            transaction: t,
          });
        }
      }

      land.available = land.available === "true" || land.available === "false" ? land.available === "true" : null;
      land.zone = land.zone && (land.zone === "Red" || land.zone === "Yellow" || land.zone === "Green") ? land.zone : null;
      land.ownership = land.ownership === "Leasehold" || land.ownership === "Freehold" ? land.ownership : null;
      land.remarks_1 = land.remarks_1 ? land.remarks_1 : "No Remark";
      land.remarks_2 = land.remarks_2 ? land.remarks_2 : "No Remark";
      land.remarks_3 = land.remarks_3 ? land.remarks_3 : "No Remark";

      await Land.create({
        kode_propar: land.kode_propar,
        name: land.name,
        address: land.address ? land.address : null,
        property_area_id: land.property_area_id ? land.property_area_id : null,
        land_size: land.land_size ? land.land_size : null,
        zone: land.zone,
        ownership: land.ownership,
        available: land.available,
        surroundings: land.surroundings ? `${land.surroundings}` : null,

        price: Number(landFees.price) ? Number(landFees.price) : 0,
        price_currency: landFees.price_currency === "Rupiah" || landFees.price_currency === "US Dollar" ? `${landFees.price_currency}` : null,
        property_payment_term_id: landFees.property_payment_term_id ? landFees.property_payment_term_id : null,
        vat_percentage: Number(landFees.vat_percentage) ? Number(landFees.vat_percentage) : 0,
        vat_is_included: landFees.vat_is_included === true || landFees.vat_is_included === false ? landFees.vat_is_included : null,
        wht_percentage: Number(landFees.wht_percentage) ? Number(landFees.wht_percentage) : 0,
        wht_is_included: landFees.wht_is_included === true || landFees.wht_is_included === false ? landFees.wht_is_included : null,
        lease_term_time: Number(landFees.lease_term_time) ? Number(landFees.lease_term_time) : null,
        lease_term_type: landFees.lease_term_type === "Month" || landFees.lease_term_type === "Year" ? `${landFees.lease_term_type}` : null,

        property_person_in_charge_id: land.pic_id ? land.pic_id : null,
        remarks_1: land.remarks_1,
        remarks_2: land.remarks_2,
        remarks_3: land.remarks_3,
      }, { transaction: t });

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            land_kode_propar: land.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/land/${land.kode_propar}/${photo.filename}`,
          };
        });

        await LandPhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Land ${land.kode_propar} Photos are CREATED` }, {
          transaction: t,
        });
      }

      await Log.create({ status_code: 201, username: req.username ?? null, message: `Land ${land.kode_propar} is CREATED` }, {
        transaction: t,
      });
    });
  } catch (error) {
    if (req.files.length > 0) {
      for (const image of req.files) {
        fs.unlink(image.path, (err) => {
          if (err) throw err;
        });
      }
    }

    if (error.name === "SequelizeUniqueConstraintError" && error.errors[0].path === "PRIMARY" && error.errors[0].instance instanceof Land) {
      const err = new ErrorDetails("LandError", "kode_propar", "kode_propar must be unique");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (error.errors && error.errors.length > 0) {
      error.errors.map(err => {
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.path]: err.message });
      })
    }

    throw error;
  }
}

module.exports = createNewLand;
