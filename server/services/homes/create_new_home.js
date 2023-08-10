const fs = require('fs');
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { Home, HomePhoto, HomeFacility } = require("../../models/home");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../models/property');

const createNewHome = async (req) => {
  const { facilities, fees, pic, ...home } = req.body;

  const homeFees = fees ? JSON.parse(fees) : null;
  const homeFacilities = facilities ? JSON.parse(facilities) : null;
  const homePic = pic ? JSON.parse(pic) : null;

  try {
    await sequelize.transaction(async (t) => {
      if (!home.kode_propar) {
        const err = new ErrorDetails("HomeError", "kode_propar", "kode_propar must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      let pattern = /^[A-Z]{1,7}[0-9]{3}$/;

      if (!pattern.test(home.kode_propar)) {
        const err = new ErrorDetails("HomeError", "kode_propar", [
          "total character must not be more than 10",
          "last 3 characters of kode_propar must be digits",
          "the rest of the characters must be capitalized letter",
        ]);

        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (!home.name) {
        const err = new ErrorDetails("HomeError", "name", "name must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      pattern = /[^a-zA-Z0-9 ]+/;

      if (pattern.test(home.name)) {
        const err = new ErrorDetails("HomeError", "name", "name must not contain special character");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (typeof homePic !== "object" || Array.isArray(homePic) || homePic === null || Object.keys(homePic).length === 0) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "pic", [
          "pic must be an object",
          "pic must not be null"
        ]);
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const where = {};

      if (!homePic.fullname) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      where.fullname = homePic.fullname;

      if (homePic.role) {
        if (typeof homePic.role !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!homePic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof homePic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        homePic.role_id = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: homePic.role },
          defaults: { name: homePic.role },
          transaction: t,
        });

        where.property_person_in_charge_role_id = homePic.role_id[0].id;
        where.phone_number = homePic.phone_number;

        if (homePic.role_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Role ${homePic.role} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Role ${homePic.role} data` }, {
            transaction: t,
          });
        }
      }

      if (homePic.company) {
        if (typeof homePic.company !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "company", "company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!homePic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof homePic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        homePic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: homePic.company },
          defaults: { name: homePic.company },
          transaction: t,
        });

        where.property_person_in_charge_company_id = homePic.company_id[0].id;
        where.phone_number = homePic.phone_number;

        if (homePic.company_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Company ${homePic.company} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Company ${homePic.company} data` }, {
            transaction: t,
          });
        }
      }

      const existingPIC = await PropertyPersonInCharge.findOrCreate({
        where,
        defaults: where,
        transaction: t,
      });

      home.pic_id = existingPIC[0].id;

      if (existingPIC[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${homePic.fullname} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${homePic.fullname} data` }, {
          transaction: t,
        });
      }

      if (!home.property_area) {
        const err = new ErrorDetails("HomeError", "property_area", "property_area must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const area = await PropertyArea.findOrCreate({
        where: { region_name: home.property_area },
        defaults: { region_name: home.property_area },
        transaction: t,
      });

      if (!area) {
        const err = new ErrorDetails("HomeError", "property_area", "property_area invalid region_name");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      home.property_area_id = area[0].id;

      if (area[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${home.property_area} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${home.property_area} data` }, {
          transaction: t,
        });
      }

      if (home.land_size) {
        home.land_size = Number(home.land_size);

        if (typeof home.land_size !== "number") {
          const err = new ErrorDetails("HomeError", "land_size", "land_size must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.building_size) {
        home.building_size = Number(home.building_size);

        if (typeof home.building_size !== "number") {
          const err = new ErrorDetails("HomeError", "building_size", "building_size must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.building_size) {
        home.building_size = Number(home.building_size);

        if (typeof home.building_size !== "number") {
          const err = new ErrorDetails("HomeError", "building_size", "building_size must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.bedroom) {
        home.bedroom = Number(home.bedroom);

        if (typeof home.bedroom !== "number") {
          const err = new ErrorDetails("HomeError", "bedroom", "bedroom must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.bathroom) {
        home.bathroom = Number(home.bathroom);

        if (typeof home.bathroom !== "number") {
          const err = new ErrorDetails("HomeError", "bathroom", "bathroom must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.study_room) {
        home.study_room = Number(home.study_room);

        if (typeof home.study_room !== "number") {
          const err = new ErrorDetails("HomeError", "study_room", "study_room must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (home.carport_or_garage) {
        home.carport_or_garage = Number(home.carport_or_garage);

        if (typeof home.carport_or_garage !== "number") {
          const err = new ErrorDetails("HomeError", "carport_or_garage", "carport_or_garage must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (homeFees.property_payment_terms_name) {
        const pt = await PropertyPaymentTerm.findOrCreate({
          where: { payment_term: homeFees.property_payment_terms_name },
          defaults: { payment_term: homeFees.property_payment_terms_name },
          transaction: t,
        });

        homeFees.property_payment_term_id = pt[0].id;

        if (pt[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Payment Term ${homeFees.property_payment_terms_name} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Payment Term ${homeFees.property_payment_terms_name} data` }, {
            transaction: t,
          });
        }
      }

      home.available = home.available === "true" || home.available === "false" ? home.available === "true" : null;
      home.furnishing = home.furnishing && (home.furnishing === "Unfurnished" || home.furnishing === "Semi Furnished" || home.furnishing === "Fully Furnished") ? home.furnishing : null;
      home.backyard = home.backyard === "true" || home.backyard === "false" ? home.backyard === "true" : null;
      home.swimming_pool = home.swimming_pool === "true" || home.swimming_pool === "false" ? home.swimming_pool === "true" : null;
      home.house_type = home.house_type === "Compound" || home.house_type === "Standalone" ? home.house_type : null;
      home.remarks_1 = home.remarks_1 ? home.remarks_1 : "No Remark";
      home.remarks_2 = home.remarks_2 ? home.remarks_2 : "No Remark";
      home.remarks_3 = home.remarks_3 ? home.remarks_3 : "No Remark";

      await Home.create({
        kode_propar: home.kode_propar,
        name: home.name,
        address: home.address ? home.address : null,
        property_area_id: home.property_area_id ? home.property_area_id : null,
        building_completion: Number(home.building_completion) ? Number(home.building_completion) : 0,
        certificates: typeof home.certificates === "string" ? home.certificates : null,
        semi_gross_area: home.semi_gross_area ? home.semi_gross_area : null,
        land_size: home.land_size ? home.land_size : null,
        building_size: home.building_size ? home.building_size : null,
        stories: home.stories ? home.stories : null,
        furnishing: home.furnishing,
        bedroom: home.bedroom,
        bathroom: home.bathroom,
        study_room: home.study_room,
        carport_or_garage: home.carport_or_garage,
        available: home.available,
        backyard: home.backyard,
        swimming_pool: home.swimming_pool,
        house_type: home.house_type,

        rental_price: Number(homeFees.rental_price) ? Number(homeFees.rental_price) : 0,
        selling_price: Number(homeFees.selling_price) ? Number(homeFees.selling_price) : 0,
        compound_fee: Number(homeFees.compound_fee) ? Number(homeFees.compound_fee) : 0,
        compound_fee_coverage: homeFees.compound_fee_coverage ? `${homeFees.compound_fee_coverage}` : null,
        price_currency: homeFees.price_currency === "Rupiah" || homeFees.price_currency === "US Dollar" ? `${homeFees.price_currency}` : null,
        property_payment_term_id: homeFees.property_payment_term_id ? homeFees.property_payment_term_id : null,
        vat_percentage: Number(homeFees.vat_percentage) ? Number(homeFees.vat_percentage) : 0,
        vat_is_included: homeFees.vat_is_included === true || homeFees.vat_is_included === false ? homeFees.vat_is_included : null,
        wht_percentage: Number(homeFees.wht_percentage) ? Number(homeFees.wht_percentage) : 0,
        wht_is_included: homeFees.wht_is_included === true || homeFees.wht_is_included === false ? homeFees.wht_is_included : null,
        lease_term_time: Number(homeFees.lease_term_time) ? Number(homeFees.lease_term_time) : null,
        lease_term_type: homeFees.lease_term_type === "Month" || homeFees.lease_term_type === "Year" ? `${homeFees.lease_term_type}` : null,

        property_person_in_charge_id: home.pic_id ? home.pic_id : null,
        remarks_1: home.remarks_1,
        remarks_2: home.remarks_2,
        remarks_3: home.remarks_3,
      }, { transaction: t });

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            home_kode_propar: home.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/home/${home.kode_propar}/${photo.filename}`,
          };
        });

        await HomePhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Home ${home.kode_propar} Photos are CREATED` }, {
          transaction: t,
        });
      }

      if (homeFacilities) {
        if (!(Array.isArray(homeFacilities))) {
          const err = new ErrorDetails("HomeFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (homeFacilities.length < 1) {
          const err = new ErrorDetails("HomeFacilityError", "facilities", "facilities must have a minimum of one item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        const facilities = await Promise.all(
          homeFacilities.map(async (item) => {
            if (!item.property_facility_name) {
              const err = new ErrorDetails("HomeFacilityError", "property_facility_name", "property_facility_name must not be null");
              // TODO: ganti console ke log kalau sudah mau production
              console.error(err);
              throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
            }

            const facility = await PropertyFacilityName.findOrCreate({
              where: { facility_name: `${item.property_facility_name}` },
              defaults: { facility_name: `${item.property_facility_name}` },
              transaction: t,
            });

            if (!facility) {
              const err = new ErrorDetails("HomeFacilityError", "property_facility_name", "property_facility_name invalid name");
              // TODO: ganti console ke log kalau sudah mau production
              console.error(err);
              throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
            }

            if (facility[1]) {
              await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Facility ${item.property_facility_name} is CREATED` }, {
                transaction: t,
              });
            } else {
              await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Facility ${item.property_facility_name} data` }, {
                transaction: t,
              });
            }

            return {
              home_kode_propar: home.kode_propar,
              property_facility_name_id: facility[0].id,
            };
          }),
        );

        await HomeFacility.bulkCreate(facilities, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Home ${home.kode_propar} Facilities are CREATED` }, {
          transaction: t,
        });
      }

      await Log.create({ status_code: 201, username: req.username ?? null, message: `Home ${home.kode_propar} is CREATED` }, {
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

    if (error.name === "SequelizeUniqueConstraintError" && error.errors[0].path === "PRIMARY" && error.errors[0].instance instanceof Home) {
      const err = new ErrorDetails("HomeError", "kode_propar", "kode_propar must be unique");
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

module.exports = createNewHome;
