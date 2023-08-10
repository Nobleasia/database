const fs = require("fs");
const path = require("path");
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../models/property');
const { Office, OfficePhoto, OfficeFacility } = require("../../models/office");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const updateOrCreateOfficeById = async (req) => {

  if (!req.params.kode_propar) {
    const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const { fees, facilities, pic, deleted_photo_ids, restored_photo_ids, ...newOffice } = req.body;

  const newOfficeFees = fees ? JSON.parse(fees) : null;
  const newOfficeFacilities = facilities ? JSON.parse(facilities) : null;
  const officePic = pic ? JSON.parse(pic) : null;
  const officePhotos = deleted_photo_ids ? JSON.parse(deleted_photo_ids) : null;
  const restoredPhotos = restored_photo_ids ? JSON.parse(restored_photo_ids) : null;

  try {
    await sequelize.transaction(async (t) => {
      const office = await Office.findByPk(req.params.kode_propar);

      if (!office) {
        const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            office_kode_propar: office.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/office/${office.kode_propar}/${photo.filename}`,
          };
        });

        await OfficePhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Insert new photo in Office ${office.kode_propar} data` }, {
          transaction: t,
        });
      }

      if (newOfficeFacilities) {
        if (!(Array.isArray(newOfficeFacilities))) {
          const err = new ErrorDetails("OfficeFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (newOfficeFacilities.length === 0) {
          await OfficeFacility.destroy({
            where: {
              office_kode_propar: office.kode_propar,
            },
            force: true,
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Office ${office.kode_propar} Facilities` }, {
            transaction: t,
          });

          return;
        }

        await OfficeFacility.destroy({
          where: {
            office_kode_propar: office.kode_propar,
          },
          force: true,
          transaction: t,
        });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Office ${office.kode_propar} Facilities` }, {
          transaction: t,
        });

        for (const newFacility of newOfficeFacilities) {
          const facilityObj = {};

          facilityObj.office_kode_propar = office.kode_propar;

          if (!newFacility.property_facility_name) {
            const err = new ErrorDetails("OfficeFacilityError", "property_facility_name", "property_facility_name must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof newFacility.property_facility_name !== "string") {
            const err = new ErrorDetails("OfficeFacilityError", "property_facility_name", "property_facility_name must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          let facility = await PropertyFacilityName.findOne({
            where: { facility_name: newFacility.property_facility_name },
            transaction: t,
          });

          // create new property_payment_terms if not exist
          if (!facility) {
            facility = await PropertyFacilityName.create({ facility_name: newFacility.property_facility_name }, {
              transaction: t,
            });

            await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Facility ${newFacility.property_facility_name} is CREATED` }, {
              transaction: t,
            });
          }

          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Facility ${newFacility.property_facility_name} data` }, {
            transaction: t,
          });

          facilityObj.property_facility_name_id = facility.id;

          await OfficeFacility.create(facilityObj, { transaction: t });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Facilities` }, {
            transaction: t,
          });
        }
      }

      if (officePhotos) {
        if (!(Array.isArray(officePhotos))) {
          const err = new ErrorDetails("OfficePhotoError", "deleted_photo_ids", "deleted_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (officePhotos.length < 1) {
          const err = new ErrorDetails("OfficePhotoError", "deleted_photo_ids", "deleted_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of officePhotos) {

          if (!photo.id) {
            const err = new ErrorDetails("OfficePhotoError", "id", "deleted_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("OfficePhotoError", "id", "deleted_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (photo.force_delete === undefined) {
            const err = new ErrorDetails("OfficePhotoError", "force_delete", "force_delete must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.force_delete !== "boolean") {
            const err = new ErrorDetails("OfficePhotoError", "force_delete", "force_delete must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await OfficePhoto.findOne({
            where: {
              id: photo.id,
              office_kode_propar: office.kode_propar,
            },
            paranoid: !photo.force_delete,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("OfficePhotoError", "id", "photo id not found");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
          }

          const { photo_path } = existingPhoto;

          await existingPhoto.destroy({
            force: photo.force_delete,
            transaction: t
          });

          if (photo.force_delete) {
            const folderPath = path.dirname(photo_path);
            fs.readdir(folderPath, (err, files) => {
              if (err) throw err;

              fs.unlink(photo_path, (err) => {
                if (err) throw err;
              });

              if (files.length < 1) {
                fs.rm(folderPath, { recursive: true }, (err) => {
                  if (err) throw err;
                  return;
                });
              }
            });
          }

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Office ${office.kode_propar} photos data` }, {
            transaction: t,
          });
        }
      }

      if (restoredPhotos) {
        if (!(Array.isArray(restoredPhotos))) {
          const err = new ErrorDetails("OfficePhotoError", "restored_photo_ids", "restored_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (restoredPhotos.length < 1) {
          const err = new ErrorDetails("OfficePhotoError", "restored_photo_ids", "restored_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of restoredPhotos) {
          if (!photo.id) {
            const err = new ErrorDetails("OfficePhotoError", "id", "restored_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("OfficePhotoError", "id", "restored_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await OfficePhoto.findOne({
            where: {
              id: photo.id,
              office_kode_propar: office.kode_propar,
            },
            paranoid: false,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("OfficePhotoError", "id", "photo id not found");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
          }

          await existingPhoto.restore({ transaction: t });

          await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Office ${office.kode_propar} Photos` }, {
            transaction: t,
          });
        }
      }

      if (officePic !== null && typeof officePic === "object" && Object.keys(officePic).length !== 0) {
        const where = {};

        if (officePic.fullname) {
          if (typeof officePic.fullname !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.fullname = officePic.fullname;
        }

        if (officePic.phone_number) {
          if (typeof officePic.phone_number !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.phone_number = officePic.phone_number;
        }

        if (officePic.role) {
          if (typeof officePic.role !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
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

          officePic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
            where: { name: officePic.company },
            defaults: { name: officePic.company },
            transaction: t,
          });

          where.property_person_in_charge_company_id = officePic.company_id[0].id;

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

        office.property_person_in_charge_id = existingPIC[0].id;

        if (existingPIC[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${officePic.fullname} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${officePic.fullname} data` }, {
            transaction: t,
          });
        }

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} PIC` }, {
          transaction: t,
        });
      }

      if (newOfficeFees !== null && typeof newOfficeFees === "object" && Object.keys(newOfficeFees).length !== 0) {
        if (newOfficeFees.price_currency) {
          const priceCurrency = newOfficeFees.price_currency;
          if (typeof priceCurrency !== "string") {
            const err = new ErrorDetails("OfficeError", "price_currency", "price_currency must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(priceCurrency === "Rupiah" || priceCurrency === "US Dollar")) {
            const err = new ErrorDetails("OfficeError", "price_currency", "price_currency must be Rupiah or US Dollar");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.price_currency = priceCurrency;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Price Currency` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.rental_price !== undefined) {
          const rentalPrice = Number(newOfficeFees.rental_price);
          if (typeof rentalPrice !== "number") {
            const err = new ErrorDetails("OfficeError", "rental_price", "rental_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.rental_price = rentalPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Rental Price` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.selling_price !== undefined) {
          const sellingPrice = Number(newOfficeFees.selling_price);
          if (typeof sellingPrice !== "number") {
            const err = new ErrorDetails("OfficeError", "selling_price", "selling_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.selling_price = sellingPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Selling Price` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.property_payment_terms_name) {
          if (typeof newOfficeFees.property_payment_terms_name !== "string") {
            const err = new ErrorDetails("OfficeError", "property_payment_terms_name", "property_payment_terms_name must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const paymentTermName = newOfficeFees.property_payment_terms_name;
          const [paymentTerm, isCreated] = await PropertyPaymentTerm.findOrCreate({
            where: { payment_term: paymentTermName },
            defaults: { payment_term: paymentTermName },
            transaction: t,
          });

          office.property_payment_term_id = paymentTerm.id;

          const logMessage = isCreated
            ? `Property Payment Term ${paymentTermName} is CREATED`
            : `Viewing Property Payment Term ${paymentTermName} data`;

          await Log.create({ status_code: isCreated ? 201 : 200, username: req.username ?? null, message: logMessage }, {
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Payment Term` }, {
            transaction: t,
          });
        } else if (newOfficeFees.property_payment_terms_name === "") {
          office.property_payment_term_id = null;
        }

        if (newOfficeFees.vat_percentage !== undefined) {
          const vatPercentage = Number(newOfficeFees.vat_percentage);
          if (typeof vatPercentage !== "number") {
            const err = new ErrorDetails("OfficeError", "vat_percentage", "vat_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.vat_percentage = vatPercentage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} VAT Percentage` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.vat_is_included) {
          const vatIsIncluded = newOfficeFees.vat_is_included;
          if (typeof vatIsIncluded !== "boolean") {
            const err = new ErrorDetails("OfficeError", "vat_is_included", "vat_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.vat_is_included = vatIsIncluded;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} VAT Is Included` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.wht_percentage !== undefined) {
          const whtPercentage = Number(newOfficeFees.wht_percentage);
          if (typeof whtPercentage !== "number") {
            const err = new ErrorDetails("OfficeError", "wht_percentage", "wht_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.wht_percentage = whtPercentage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} WHT Percentage` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.wht_is_included) {
          const whtIsIncluded = newOfficeFees.wht_is_included;
          if (typeof whtIsIncluded !== "boolean") {
            const err = new ErrorDetails("OfficeError", "wht_is_included", "wht_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.wht_is_included = whtIsIncluded;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} WHT Is Included` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.lease_term_time !== undefined) {
          const leaseTermTime = Number(newOfficeFees.lease_term_time);
          if (typeof leaseTermTime !== "number") {
            const err = new ErrorDetails("OfficeError", "lease_term_time", "lease_term_time must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.lease_term_time = leaseTermTime;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Lease Term Time` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.lease_term_type === "") {
          office.lease_term_type = null;
        } else {
          const validLeaseTermTypes = ["Month", "Year"];
          const leaseTermType = newOfficeFees.lease_term_type;

          if (typeof leaseTermType !== "string") {
            const err = new ErrorDetails("OfficeError", "lease_term_type", "lease_term_type must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!validLeaseTermTypes.includes(leaseTermType)) {
            const err = new ErrorDetails("OfficeError", "lease_term_type", "lease_term_type must be Month or Year");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.lease_term_type = leaseTermType;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Lease Term Type` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.service_charge_price !== undefined) {
          const serviceChargePrice = Number(newOfficeFees.service_charge_price);
          if (typeof serviceChargePrice !== "number") {
            const err = new ErrorDetails("OfficeError", "service_charge_price", "service_charge_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.service_charge_price = serviceChargePrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Service Charge Price` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.service_charge_time) {
          const serviceChargeTime = newOfficeFees.service_charge_time;
          if (typeof serviceChargeTime !== "string") {
            const err = new ErrorDetails("OfficeError", "service_charge_time", "service_charge_time must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(serviceChargeTime === "Month" || serviceChargeTime === "Year")) {
            const err = new ErrorDetails("OfficeError", "service_charge_time", "service_charge_time must be Month or Year");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.service_charge_time = serviceChargeTime;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Service Charge Time` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.overtime_price !== undefined) {
          const overtimePrice = Number(newOfficeFees.overtime_price);
          if (typeof overtimePrice !== "number") {
            const err = new ErrorDetails("OfficeError", "overtime_price", "overtime_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.overtime_price = overtimePrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Overtime Price` }, {
            transaction: t,
          });
        }

        if (newOfficeFees.overtime_time) {
          const overtimeTime = newOfficeFees.overtime_time;
          if (typeof overtimeTime !== "string") {
            const err = new ErrorDetails("OfficeError", "overtime_time", "overtime_time must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(overtimeTime === "Hour" || overtimeTime === "Day")) {
            const err = new ErrorDetails("OfficeError", "overtime_time", "overtime_time must be Hour or Day");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.overtime_time = overtimeTime;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Overtime Time` }, {
            transaction: t,
          });
        }

      }

      if (newOffice !== null && typeof newOffice === "object" && Object.keys(newOffice).length !== 0) {

        if (newOffice.name) {
          if (typeof newOffice.name !== "string") {
            const err = new ErrorDetails("OfficeError", "name", "name must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const pattern = /[^a-zA-Z0-9 ]+/;

          if (pattern.test(newOffice.name)) {
            const err = new ErrorDetails("OfficeError", "name", "name must not contain special character");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.name = newOffice.name;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Name` }, {
            transaction: t,
          });
        }

        if (newOffice.address) {
          office.address = newOffice.address;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Address` }, {
            transaction: t,
          });
        }

        if (newOffice.property_area) {
          const area = await PropertyArea.findOrCreate({
            where: { region_name: newOffice.property_area },
            defaults: { region_name: newOffice.property_area },
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
            await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${newOffice.property_area} is CREATED` }, {
              transaction: t,
            });
          } else {
            await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${newOffice.property_area} data` }, {
              transaction: t,
            });
          }

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Area` }, {
            transaction: t,
          });
        }

        if (newOffice.semi_gross_area !== undefined) {
          const semi_gross_area = Number(newOffice.semi_gross_area);
          if (typeof semi_gross_area !== "number") {
            const err = new ErrorDetails("OfficeError", "semi_gross_area", "semi_gross_area must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.semi_gross_area = semi_gross_area;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Semi Gross Area` }, {
            transaction: t,
          });
        }

        if (newOffice.building_completion !== undefined) {
          const building_completion = Number(newOffice.building_completion);
          if (typeof building_completion !== "number") {
            const err = new ErrorDetails("OfficeError", "building_completion", "building_completion must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.building_completion = building_completion;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Building Completion` }, {
            transaction: t,
          });
        }

        if (newOffice.grade) {
          if (typeof newOffice.grade !== "string") {
            const err = new ErrorDetails("OfficeError", "grade", "grade must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.grade = newOffice.grade;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Grade` }, {
            transaction: t,
          });
        }

        if (newOffice.floor) {
          if (typeof newOffice.floor !== "string") {
            const err = new ErrorDetails("OfficeError", "floor", "floor must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.floor = newOffice.floor;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Floor` }, {
            transaction: t,
          });
        }

        if (newOffice.condition) {
          const { condition } = newOffice;
          if (!(condition === "Bare" || condition === "Semi Fitted" || condition === "Fitted")) {
            const err = new ErrorDetails("OfficeError", "condition", "invalid value");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.condition = condition;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Condition` }, {
            transaction: t,
          });
        }

        if (newOffice.parking_ratio !== undefined) {
          const rentalPrice = Number(newOffice.parking_ratio);
          if (typeof rentalPrice !== "number") {
            const err = new ErrorDetails("OfficeError", "parking_ratio", "parking_ratio must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          office.parking_ratio = newOffice.parking_ratio;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Parking Ratio` }, {
            transaction: t,
          });
        }

        if (newOffice.available) {
          office.available = (newOffice.available).toLowerCase() === "true";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Available` }, {
            transaction: t,
          });
        }

        if (newOffice.certificates) {
          office.certificates = newOffice.certificates;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Certificates` }, {
            transaction: t,
          });
        }

        if (newOffice.security_deposit) {
          office.security_deposit = newOffice.security_deposit;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Security Deposit` }, {
            transaction: t,
          });
        }

        if (newOffice.remarks_1 || newOffice.remarks_1 == "") {
          office.remarks_1 = newOffice.remarks_1 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Remarks 1` }, {
            transaction: t,
          });
        }

        if (newOffice.remarks_2 || newOffice.remarks_2 == "") {
          office.remarks_2 = newOffice.remarks_2 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Remarks 2` }, {
            transaction: t,
          });
        }

        if (newOffice.remarks_3 || newOffice.remarks_3 == "") {
          office.remarks_3 = newOffice.remarks_3 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Remarks 3` }, {
            transaction: t,
          });
        }

        if (newOffice.kode_propar) {
          const pattern = /^[A-Z]{1,7}[0-9]{3}$/;

          if (!pattern.test(newOffice.kode_propar)) {
            const err = new ErrorDetails("OfficeError", "kode_propar", [
              "total character must not be more than 10",
              "last 3 characters of kode_propar must be digits",
              "the rest of the characters must be capitalized letter",
            ]);

            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingOffice = await Office.findOne({ where: { kode_propar: newOffice.kode_propar } });

          if (existingOffice && existingOffice.id !== office.id) {
            const err = new ErrorDetails("OfficeError", "kode_propar", "kode_propar has been taken");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          await Office.update({ kode_propar: newOffice.kode_propar }, {
            where: { kode_propar: office.kode_propar },
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} Kode Propar to ${newOffice.kode_propar}` }, {
            transaction: t,
          });
        }
      }

      await office.save({ transaction: t });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Office ${office.kode_propar} data` }, {
        transaction: t,
      });
    });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      for (const image of req.files) {
        fs.unlink(image.path, (err) => {
          if (err) throw err;
        });
      }
    }

    throw error;
  }
}

module.exports = updateOrCreateOfficeById;
