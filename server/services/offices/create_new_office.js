const fs = require('fs');
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { Office, OfficePhoto, OfficeFacility } = require("../../models/office");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../models/property');

const createNewOffice = async (req) => {
  const { facilities, fees, pic, ...office } = req.body;

  const officeFees = fees ? JSON.parse(fees) : null;
  const officeFacilities = facilities ? JSON.parse(facilities) : null;
  const officePic = pic ? JSON.parse(pic) : null;

  try {
    await sequelize.transaction(async (t) => {
      if (!office.kode_propar) {
        const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      let pattern = /^[A-Z]{1,7}[0-9]{3}$/;

      if (!pattern.test(office.kode_propar)) {
        const err = new ErrorDetails("OfficeError", "kode_propar", [
          "total character must not be more than 10",
          "last 3 characters of kode_propar must be digits",
          "the rest of the characters must be capitalized letter",
        ]);

        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (!office.name) {
        const err = new ErrorDetails("OfficeError", "name", "name must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      pattern = /[^a-zA-Z0-9 ]+/;

      if (pattern.test(office.name)) {
        const err = new ErrorDetails("OfficeError", "name", "name must not contain special character");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (typeof officePic !== "object" || Array.isArray(officePic) || officePic === null || Object.keys(officePic).length === 0) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "pic", [
          "pic must be an object",
          "pic must not be null"
        ]);
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const where = {};

      if (!officePic.fullname) {
        const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      where.fullname = officePic.fullname;

      if (officePic.role) {
        if (typeof officePic.role !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!officePic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof officePic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        officePic.role_id = await PropertyPersonInChargeRole.findOrCreate({
          where: { name: officePic.role },
          defaults: { name: officePic.role },
          transaction: t,
        });

        where.property_person_in_charge_role_id = officePic.role_id[0].id;
        where.phone_number = officePic.phone_number;

        if (officePic.role_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Role ${officePic.role} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Role ${officePic.role} data` }, {
            transaction: t,
          });
        }
      }

      if (officePic.company) {
        if (typeof officePic.company !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "company", "company must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (!officePic.phone_number) {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must not be null");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (typeof officePic.phone_number !== "string") {
          const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        officePic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
          where: { name: officePic.company },
          defaults: { name: officePic.company },
          transaction: t,
        });

        where.property_person_in_charge_company_id = officePic.company_id[0].id;
        where.phone_number = officePic.phone_number;

        if (officePic.company_id[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge Company ${officePic.company} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge Company ${officePic.company} data` }, {
            transaction: t,
          });
        }
      }

      const existingPIC = await PropertyPersonInCharge.findOrCreate({
        where,
        defaults: where,
        transaction: t,
      });

      office.pic_id = existingPIC[0].id;

      if (existingPIC[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${officePic.fullname} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${officePic.fullname} data` }, {
          transaction: t,
        });
      }

      if (!office.property_area) {
        const err = new ErrorDetails("OfficeError", "property_area", "property_area must not be null");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      const area = await PropertyArea.findOrCreate({
        where: { region_name: office.property_area },
        defaults: { region_name: office.property_area },
        transaction: t,
      });

      if (!area) {
        const err = new ErrorDetails("OfficeError", "property_area", "property_area invalid region_name");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      office.property_area_id = area[0].id;

      if (area[1]) {
        await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${office.property_area} is CREATED` }, {
          transaction: t,
        });
      } else {
        await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${office.property_area} data` }, {
          transaction: t,
        });
      }

      if (office.semi_gross_area) {
        office.semi_gross_area = Number(office.semi_gross_area);

        if (typeof office.semi_gross_area !== "number") {
          const err = new ErrorDetails("OfficeError", "semi_gross_area", "semi_gross_area must be integer");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }
      }

      if (officeFees.property_payment_terms_name) {
        const pt = await PropertyPaymentTerm.findOrCreate({
          where: { payment_term: officeFees.property_payment_terms_name },
          defaults: { payment_term: officeFees.property_payment_terms_name },
          transaction: t,
        });

        officeFees.property_payment_term_id = pt[0].id;

        if (pt[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Payment Term ${officeFees.property_payment_terms_name} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Payment Term ${officeFees.property_payment_terms_name} data` }, {
            transaction: t,
          });
        }
      }

      office.available = office.available === "true" || office.available === "false" ? office.available === "true" : null;
      office.condition = office.condition && (office.condition === "Bare" || office.condition === "Semi Fitted" || office.condition === "Fitted") ? office.condition : null;
      office.remarks_1 = office.remarks_1 ? office.remarks_1 : "No Remark";
      office.remarks_2 = office.remarks_2 ? office.remarks_2 : "No Remark";
      office.remarks_3 = office.remarks_3 ? office.remarks_3 : "No Remark";

      await Office.create({
        kode_propar: office.kode_propar,
        name: office.name,
        address: office.address ? office.address : null,
        property_area_id: office.property_area_id ? office.property_area_id : null,
        building_completion: Number(office.building_completion) ? Number(office.building_completion) : 0,
        certificates: typeof office.certificates === "string" ? office.certificates : null,
        semi_gross_area: office.semi_gross_area ? office.semi_gross_area : null,
        grade: office.grade ? office.grade : null,
        floor: office.floor ? office.floor : null,
        condition: office.condition,
        available: office.available,

        rental_price: Number(officeFees.rental_price) ? Number(officeFees.rental_price) : 0,
        selling_price: Number(officeFees.selling_price) ? Number(officeFees.selling_price) : 0,
        service_charge_price: Number(officeFees.service_charge_price) ? Number(officeFees.service_charge_price) : 0,
        service_charge_time: officeFees.service_charge_time === "Month" || officeFees.service_charge_time === "Year" ? `${officeFees.service_charge_time}` : null,
        overtime_price: Number(officeFees.overtime_price) ? Number(officeFees.overtime_price) : 0,
        overtime_time: officeFees.overtime_time === "Day" || officeFees.overtime_time === "Hour" ? `${officeFees.overtime_time}` : null,
        price_currency: officeFees.price_currency === "Rupiah" || officeFees.price_currency === "US Dollar" ? `${officeFees.price_currency}` : null,
        property_payment_term_id: officeFees.property_payment_term_id ? officeFees.property_payment_term_id : null,
        vat_percentage: Number(officeFees.vat_percentage) ? Number(officeFees.vat_percentage) : 0,
        vat_is_included: officeFees.vat_is_included === true || officeFees.vat_is_included === false ? officeFees.vat_is_included : null,
        wht_percentage: Number(officeFees.wht_percentage) ? Number(officeFees.wht_percentage) : 0,
        wht_is_included: officeFees.wht_is_included === true || officeFees.wht_is_included === false ? officeFees.wht_is_included : null,
        lease_term_time: Number(officeFees.lease_term_time) ? Number(officeFees.lease_term_time) : null,
        lease_term_type: officeFees.lease_term_type === "Month" || officeFees.lease_term_type === "Year" ? `${officeFees.lease_term_type}` : null,
        parking_ratio: Number(office.parking_ratio) ? Number(office.parking_ratio) : 0,

        security_deposit: typeof office.security_deposit === "string" ? office.security_deposit : null,
        property_person_in_charge_id: office.pic_id ? office.pic_id : null,
        remarks_1: office.remarks_1,
        remarks_2: office.remarks_2,
        remarks_3: office.remarks_3,
      }, { transaction: t });

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            office_kode_propar: office.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/office/${office.kode_propar}/${photo.filename}`,
          };
        });

        await OfficePhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Office ${office.kode_propar} Photos are CREATED` }, {
          transaction: t,
        });
      }

      if (officeFacilities) {
        if (!(Array.isArray(officeFacilities))) {
          const err = new ErrorDetails("OfficeFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (officeFacilities.length < 1) {
          const err = new ErrorDetails("OfficeFacilityError", "facilities", "facilities must have a minimum of one item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        const facilities = await Promise.all(
          officeFacilities.map(async (item) => {
            if (!item.property_facility_name) {
              const err = new ErrorDetails("OfficeFacilityError", "property_facility_name", "property_facility_name must not be null");
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
              const err = new ErrorDetails("OfficeFacilityError", "property_facility_name", "property_facility_name invalid name");
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
              office_kode_propar: office.kode_propar,
              property_facility_name_id: facility[0].id,
            };
          }),
        );

        await OfficeFacility.bulkCreate(facilities, { transaction: t });

        await Log.create({ status_code: 201, username: req.username ?? null, message: `Office ${office.kode_propar} Facilities are CREATED` }, {
          transaction: t,
        });
      }

      await Log.create({ status_code: 201, username: req.username ?? null, message: `Office ${office.kode_propar} is CREATED` }, {
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

    if (error.name === "SequelizeUniqueConstraintError" && error.errors[0].path === "PRIMARY" && error.errors[0].instance instanceof Office) {
      const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar must be unique");
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

module.exports = createNewOffice;
