const fs = require('fs');
const Log = require("../../../models/log");
const { sequelize } = require("../../../utils/db");
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../../models/apartment");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../../models/property');

const createNewApartment = async (req) => {
  const { facilities, fees, pic, ...apartment } = req.body;

  const apartmentFees = fees ? JSON.parse(fees) : null;
  const apartmentFacilities = facilities ? JSON.parse(facilities) : null;
  const apartmentPic = pic ? JSON.parse(pic) : null;

  try {
    await sequelize.transaction(async (t) => {
      if (!apartment.kode_propar) {
        const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      let pattern = /^[A-Z]{1,7}[0-9]{3}$/;

      if (!pattern.test(apartment.kode_propar)) {
        const err = new ErrorDetails("ApartmentError", "kode_propar", [
          "total character must not be more than 10",
          "last 3 characters of kode_propar must be digits",
          "the rest of the characters must be capitalized letter",
        ]);

        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (!apartment.name) {
        const err = new ErrorDetails("ApartmentError", "name", "name must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      pattern = /[^a-zA-Z0-9 ]+/;

      if (pattern.test(apartment.name)) {
        const err = new ErrorDetails("ApartmentError", "name", "name must not contain special character");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (typeof apartmentPic !== "object" || Array.isArray(apartmentPic) || apartmentPic === null || Object.keys(apartmentPic).length === 0) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "pic", [
          "pic must be an object",
          "pic must not be null"
        ]);
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const where = {};

      if (!apartmentPic.fullname) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      where.fullname = apartmentPic.fullname;

      if (apartmentPic.role) {
        if (typeof apartmentPic.role !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!apartmentPic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof apartmentPic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        apartmentPic.role_id = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: apartmentPic.role },
          defaults: { name: apartmentPic.role },
          transaction: t,
        });

        where.property_person_in_charge_role_id = apartmentPic.role_id[0].id;
        where.phone_number = apartmentPic.phone_number;

        if (apartmentPic.role_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Role ${apartmentPic.role} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Role ${apartmentPic.role} data` }, {
            transaction: t,
          });
        }
      }

      if (apartmentPic.company) {
        if (typeof apartmentPic.company !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "company", "company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!apartmentPic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof apartmentPic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        apartmentPic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: apartmentPic.company },
          defaults: { name: apartmentPic.company },
          transaction: t,
        });

        where.property_person_in_charge_company_id = apartmentPic.company_id[0].id;
        where.phone_number = apartmentPic.phone_number;

        if (apartmentPic.company_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Company ${apartmentPic.company} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Company ${apartmentPic.company} data` }, {
            transaction: t,
          });
        }
      }

      const existingPIC = await PropertyPersonInCharge.findOrCreate({
        where,
        defaults: where,
        transaction: t,
      });

      apartment.pic_id = existingPIC[0].id;

      if (existingPIC[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${apartmentPic.fullname} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${apartmentPic.fullname} data` }, {
          transaction: t,
        });
      }

      if (!apartment.property_area) {
        const err = new ErrorDetails("ApartmentError", "property_area", "property_area must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const area = await PropertyArea.findOrCreate({
        where: { region_name: apartment.property_area },
        defaults: { region_name: apartment.property_area },
        transaction: t,
      });

      if (!area) {
        const err = new ErrorDetails("ApartmentError", "property_area", "property_area invalid region_name");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      apartment.property_area_id = area[0].id;

      if (area[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${apartment.property_area} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${apartment.property_area} data` }, {
          transaction: t,
        });
      }

      if (apartment.size) {
        apartment.size = Number(apartment.size);

        if (typeof apartment.size !== "number") {
          const err = new ErrorDetails("ApartmentError", "size", "size must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (apartment.bedroom) {
        apartment.bedroom = Number(apartment.bedroom);

        if (typeof apartment.bedroom !== "number") {
          const err = new ErrorDetails("ApartmentError", "bedroom", "bedroom must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (apartment.bathroom) {
        apartment.bathroom = Number(apartment.bathroom);

        if (typeof apartment.bathroom !== "number") {
          const err = new ErrorDetails("ApartmentError", "bathroom", "bathroom must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (apartment.study_room) {
        apartment.study_room = Number(apartment.study_room);

        if (typeof apartment.study_room !== "number") {
          const err = new ErrorDetails("ApartmentError", "study_room", "study_room must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (apartmentFees.property_payment_terms_name) {
        const pt = await PropertyPaymentTerm.findOrCreate({
          where: { payment_term: apartmentFees.property_payment_terms_name },
          defaults: { payment_term: apartmentFees.property_payment_terms_name },
          transaction: t,
        });

        apartmentFees.property_payment_term_id = pt[0].id;

        if (pt[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Payment Term ${apartmentFees.property_payment_terms_name} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Payment Term ${apartmentFees.property_payment_terms_name} data` }, {
            transaction: t,
          });
        }
      }

      apartment.available = apartment.available === "true" || apartment.available === "false" ? apartment.available === "true" : null;
      apartment.furnishing = apartment.furnishing && (apartment.furnishing === "Fully Furnished" || apartment.furnishing === "Semi Furnished" || apartment.furnishing === "Unfurnished") ? apartment.furnishing : null;
      apartment.remarks_1 = apartment.remarks_1 ? apartment.remarks_1 : "No Remark";
      apartment.remarks_2 = apartment.remarks_2 ? apartment.remarks_2 : "No Remark";
      apartment.remarks_3 = apartment.remarks_3 ? apartment.remarks_3 : "No Remark";

      await Apartment.create({
        kode_propar: apartment.kode_propar,
        name: apartment.name,
        address: apartment.address ? apartment.address : null,
        property_area_id: apartment.property_area_id ? apartment.property_area_id : null,
        size: apartment.size ? apartment.size : null,
        tower: apartment.tower ? apartment.tower : null,
        floor: apartment.floor ? apartment.floor : null,
        furnishing: apartment.furnishing,
        bedroom: apartment.bedroom,
        bathroom: apartment.bathroom,
        study_room: apartment.study_room,
        available: apartment.available,

        rental_price: Number(apartmentFees.rental_price) ? Number(apartmentFees.rental_price) : 0,
        selling_price: Number(apartmentFees.selling_price) ? Number(apartmentFees.selling_price) : 0,
        price_currency: apartmentFees.price_currency === "Rupiah" || apartmentFees.price_currency === "US Dollar" ? `${apartmentFees.price_currency}` : null,
        property_payment_term_id: apartmentFees.property_payment_term_id ? apartmentFees.property_payment_term_id : null,
        vat_percentage: Number(apartmentFees.vat_percentage) ? Number(apartmentFees.vat_percentage) : 0,
        vat_is_included: apartmentFees.vat_is_included === true || apartmentFees.vat_is_included === false ? apartmentFees.vat_is_included : null,
        wht_percentage: Number(apartmentFees.wht_percentage) ? Number(apartmentFees.wht_percentage) : 0,
        wht_is_included: apartmentFees.wht_is_included === true || apartmentFees.wht_is_included === false ? apartmentFees.wht_is_included : null,
        lease_term_time: Number(apartmentFees.lease_term_time) ? Number(apartmentFees.lease_term_time) : null,
        lease_term_type: apartmentFees.lease_term_type === "Month" || apartmentFees.lease_term_type === "Year" ? `${apartmentFees.lease_term_type}` : null,

        property_person_in_charge_id: apartment.pic_id ? apartment.pic_id : null,
        remarks_1: apartment.remarks_1,
        remarks_2: apartment.remarks_2,
        remarks_3: apartment.remarks_3,
      }, { transaction: t });

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            apartment_kode_propar: apartment.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/apartment/${apartment.kode_propar}/${photo.filename}`,
          };
        });

        await ApartmentPhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Apartment ${apartment.kode_propar} Photos are CREATED` }, {
          transaction: t,
        });
      }

      if (apartmentFacilities) {
        if (!(Array.isArray(apartmentFacilities))) {
          const err = new ErrorDetails("ApartmentFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (apartmentFacilities.length < 1) {
          const err = new ErrorDetails("ApartmentFacilityError", "facilities", "facilities must have a minimum of one item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        const facilities = await Promise.all(
          apartmentFacilities.map(async (item) => {
            if (!item.property_facility_name) {
              const err = new ErrorDetails("ApartmentFacilityError", "property_facility_name", "property_facility_name must not be null");
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
              const err = new ErrorDetails("ApartmentFacilityError", "property_facility_name", "property_facility_name invalid name");
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
              apartment_kode_propar: apartment.kode_propar,
              property_facility_name_id: facility[0].id,
            };
          }),
        );

        await ApartmentFacility.bulkCreate(facilities, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Apartment ${apartment.kode_propar} Facilities are CREATED` }, {
          transaction: t,
        });
      }

      await Log.create({ status_code: 201, username: req.username ?? null, message: `Apartment ${apartment.kode_propar} is CREATED` }, {
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

    if (error.name === "SequelizeUniqueConstraintError" && error.errors[0].path === "PRIMARY" && error.errors[0].instance instanceof Apartment) {
      const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar must be unique");
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

module.exports = createNewApartment;
