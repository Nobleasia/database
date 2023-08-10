const fs = require("fs");
const path = require("path");

const Log = require("../../../models/log");
const { sequelize } = require("../../../utils/db");
const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../../models/property');
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../../models/apartment");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const updateOrCreateApartmentById = async (req) => {

  if (!req.params.kode_propar) {
    const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const { fees, facilities, pic, deleted_photo_ids, restored_photo_ids, ...newApartment } = req.body;

  const newApartmentFees = fees ? JSON.parse(fees) : null;
  const newApartmentFacilities = facilities ? JSON.parse(facilities) : null;
  const apartmentPic = pic ? JSON.parse(pic) : null;
  const apartmentPhotos = deleted_photo_ids ? JSON.parse(deleted_photo_ids) : null;
  const restoredPhotos = restored_photo_ids ? JSON.parse(restored_photo_ids) : null;

  try {
    await sequelize.transaction(async (t) => {
      const apartment = await Apartment.findByPk(req.params.kode_propar);

      if (!apartment) {
        const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            apartment_kode_propar: apartment.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/apartment/${apartment.kode_propar}/${photo.filename}`,
          };
        });

        await ApartmentPhoto.bulkCreate(photos, { transaction: t });
        await Log.create({ status_code: 204, username: req.username ?? null, message: `Insert new photo in Apartment ${apartment.kode_propar} data` }, {
          transaction: t,
        });
      }

      if (newApartmentFacilities) {
        if (!(Array.isArray(newApartmentFacilities))) {
          const err = new ErrorDetails("ApartmentFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (newApartmentFacilities.length === 0) {
          await ApartmentFacility.destroy({
            where: {
              apartment_kode_propar: apartment.kode_propar,
            },
            force: true,
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Apartment ${apartment.kode_propar} Facilities` }, {
            transaction: t,
          });

          return;
        }

        await ApartmentFacility.destroy({
          where: {
            apartment_kode_propar: apartment.kode_propar,
          },
          force: true,
          transaction: t,
        });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Apartment ${apartment.kode_propar} Facilities` }, {
          transaction: t,
        });

        for (const newFacility of newApartmentFacilities) {
          const facilityObj = {};

          facilityObj.apartment_kode_propar = apartment.kode_propar;

          if (!newFacility.property_facility_name) {
            const err = new ErrorDetails("ApartmentFacilityError", "property_facility_name", "property_facility_name must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof newFacility.property_facility_name !== "string") {
            const err = new ErrorDetails("ApartmentFacilityError", "property_facility_name", "property_facility_name must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          let facility = await PropertyFacilityName.findOne({
            where: { facility_name: newFacility.property_facility_name },
            transaction: t,
          });

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

          await ApartmentFacility.create(facilityObj, { transaction: t });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Facilities` }, {
            transaction: t,
          });
        }
      }

      if (apartmentPhotos) {
        if (!(Array.isArray(apartmentPhotos))) {
          const err = new ErrorDetails("ApartmentPhotoError", "deleted_photo_ids", "deleted_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (apartmentPhotos.length < 1) {
          const err = new ErrorDetails("ApartmentPhotoError", "deleted_photo_ids", "deleted_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of apartmentPhotos) {

          if (!photo.id) {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "deleted_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "deleted_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (photo.force_delete === undefined) {
            const err = new ErrorDetails("ApartmentPhotoError", "force_delete", "force_delete must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.force_delete !== "boolean") {
            const err = new ErrorDetails("ApartmentPhotoError", "force_delete", "force_delete must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await ApartmentPhoto.findOne({
            where: {
              id: photo.id,
              apartment_kode_propar: apartment.kode_propar,
            },
            paranoid: !photo.force_delete,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "photo id not found");
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

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Apartment ${apartment.kode_propar} photos data` }, {
            transaction: t,
          });
        }
      }

      if (restoredPhotos) {
        if (!(Array.isArray(restoredPhotos))) {
          const err = new ErrorDetails("ApartmentPhotoError", "restored_photo_ids", "restored_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (restoredPhotos.length < 1) {
          const err = new ErrorDetails("ApartmentPhotoError", "restored_photo_ids", "restored_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of restoredPhotos) {
          if (!photo.id) {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "restored_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "restored_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await ApartmentPhoto.findOne({
            where: {
              id: photo.id,
              apartment_kode_propar: apartment.kode_propar,
            },
            paranoid: false,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("ApartmentPhotoError", "id", "photo id not found");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
          }

          await existingPhoto.restore({ transaction: t });
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Apartment ${apartment.kode_propar} Photos` }, {
            transaction: t,
          });
        }
      }

      if (apartmentPic !== null && typeof apartmentPic === "object" && Object.keys(apartmentPic).length !== 0) {
        const where = {};

        if (apartmentPic.fullname) {
          if (typeof apartmentPic.fullname !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.fullname = apartmentPic.fullname;
        }

        if (apartmentPic.phone_number) {
          if (typeof apartmentPic.phone_number !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.phone_number = apartmentPic.phone_number;
        }

        if (apartmentPic.role) {
          if (typeof apartmentPic.role !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
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

          apartmentPic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
            where: { name: apartmentPic.company },
            defaults: { name: apartmentPic.company },
            transaction: t,
          });

          where.property_person_in_charge_company_id = apartmentPic.company_id[0].id;

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

        apartment.property_person_in_charge_id = existingPIC[0].id;

        if (existingPIC[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${apartmentPic.fullname} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${apartmentPic.fullname} data` }, {
            transaction: t,
          });
        }

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} PIC` }, {
          transaction: t,
        });
      }

      if (newApartmentFees !== null && typeof newApartmentFees === "object" && Object.keys(newApartmentFees).length !== 0) {
        if (newApartmentFees.price_currency) {
          const priceCurrency = newApartmentFees.price_currency;
          if (typeof priceCurrency !== "string") {
            const err = new ErrorDetails("ApartmentError", "price_currency", "price_currency must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(priceCurrency === "Rupiah" || priceCurrency === "US Dollar")) {
            const err = new ErrorDetails("ApartmentError", "price_currency", "price_currency must be Rupiah or US Dollar");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.price_currency = priceCurrency;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Price Currency` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.rental_price !== undefined) {
          const rentalPrice = Number(newApartmentFees.rental_price);
          if (typeof rentalPrice !== "number") {
            const err = new ErrorDetails("ApartmentError", "rental_price", "rental_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.rental_price = rentalPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Rental Price` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.selling_price !== undefined) {
          const sellingPrice = Number(newApartmentFees.selling_price);
          if (typeof sellingPrice !== "number") {
            const err = new ErrorDetails("ApartmentError", "selling_price", "selling_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.selling_price = sellingPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Selling Price` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.property_payment_terms_name === "") {
          apartment.property_payment_term_id = null;
        } else {
          const paymentTermName = newApartmentFees.property_payment_terms_name;

          if (typeof paymentTermName !== "string") {
            const err = new ErrorDetails("ApartmentError", "property_payment_terms_name", "property_payment_terms_name must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const [paymentTerm, isCreated] = await PropertyPaymentTerm.findOrCreate({
            where: { payment_term: paymentTermName },
            defaults: { payment_term: paymentTermName },
            transaction: t,
          });

          apartment.property_payment_term_id = paymentTerm.id;

          const logMessage = isCreated
            ? `Property Payment Term ${paymentTermName} is CREATED`
            : `Viewing Property Payment Term ${paymentTermName} data`;

          await Log.create({ status_code: isCreated ? 201 : 200, username: req.username ?? null, message: logMessage }, {
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Payment Term` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.vat_percentage !== undefined) {
          const vatPercentage = Number(newApartmentFees.vat_percentage);
          if (typeof vatPercentage !== "number") {
            const err = new ErrorDetails("ApartmentError", "vat_percentage", "vat_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.vat_percentage = vatPercentage;
          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} VAT Percentage` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.vat_is_included) {
          const vatIsIncluded = newApartmentFees.vat_is_included;
          if (typeof vatIsIncluded !== "boolean") {
            const err = new ErrorDetails("ApartmentError", "vat_is_included", "vat_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.vat_is_included = vatIsIncluded;
          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} VAT is included` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.wht_percentage !== undefined) {
          const whtPercentage = Number(newApartmentFees.wht_percentage);
          if (typeof whtPercentage !== "number") {
            const err = new ErrorDetails("ApartmentError", "wht_percentage", "wht_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.wht_percentage = whtPercentage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} WHT Percentage` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.wht_is_included) {
          const whtIsIncluded = newApartmentFees.wht_is_included;
          if (typeof whtIsIncluded !== "boolean") {
            const err = new ErrorDetails("ApartmentError", "wht_is_included", "wht_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.wht_is_included = whtIsIncluded;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} WHT is included` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.lease_term_time !== undefined) {
          const leaseTermTime = Number(newApartmentFees.lease_term_time);
          if (typeof leaseTermTime !== "number") {
            const err = new ErrorDetails("ApartmentError", "lease_term_time", "lease_term_time must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.lease_term_time = leaseTermTime;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Lease Term Time` }, {
            transaction: t,
          });
        }

        if (newApartmentFees.lease_term_type === "") {
          apartment.lease_term_type = null;
        } else {
          const validLeaseTermTypes = ["Month", "Year"];
          const leaseTermType = newApartmentFees.lease_term_type;

          if (typeof leaseTermType !== "string") {
            const err = new ErrorDetails("ApartmentError", "lease_term_type", "lease_term_type must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!validLeaseTermTypes.includes(leaseTermType)) {
            const err = new ErrorDetails("ApartmentError", "lease_term_type", "lease_term_type must be Month or Year");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.lease_term_type = leaseTermType;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Lease Term Type` }, {
            transaction: t,
          });
        }
      }

      if (newApartment !== null && typeof newApartment === "object" && Object.keys(newApartment).length !== 0) {

        if (newApartment.name) {
          if (typeof newApartment.name !== "string") {
            const err = new ErrorDetails("ApartmentError", "name", "name must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const pattern = /[^a-zA-Z0-9 ]+/;

          if (pattern.test(newApartment.name)) {
            const err = new ErrorDetails("ApartmentError", "name", "name must not contain special character");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.name = newApartment.name;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Name` }, {
            transaction: t,
          });
        }

        if (newApartment.address) {
          apartment.address = newApartment.address;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Address` }, {
            transaction: t,
          });
        }

        if (newApartment.property_area) {
          const area = await PropertyArea.findOrCreate({
            where: { region_name: newApartment.property_area },
            defaults: { region_name: newApartment.property_area },
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
            await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${newApartment.property_area} is CREATED` }, {
              transaction: t,
            });
          } else {
            await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${newApartment.property_area} data` }, {
              transaction: t,
            });
          }

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Area` }, {
            transaction: t,
          });
        }

        if (newApartment.size !== undefined) {
          const size = Number(newApartment.size);
          if (typeof size !== "number") {
            const err = new ErrorDetails("ApartmentError", "size", "size must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.size = size;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Size` }, {
            transaction: t,
          });
        }

        if (newApartment.tower) {
          if (typeof newApartment.tower !== "string") {
            const err = new ErrorDetails("ApartmentError", "tower", "tower must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.tower = newApartment.tower;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Tower` }, {
            transaction: t,
          });
        }

        if (newApartment.floor) {
          if (typeof newApartment.floor !== "string") {
            const err = new ErrorDetails("ApartmentError", "floor", "floor must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.floor = newApartment.floor;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Floor` }, {
            transaction: t,
          });
        }

        if (newApartment.furnishing === "") {
          apartment.furnishing = null;
        } else {
          const validFurnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
          const furnishing = newApartment.furnishing;

          if (!validFurnishingOptions.includes(furnishing)) {
            const err = new ErrorDetails("ApartmentError", "furnishing", "Invalid furnishing value");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.furnishing = furnishing;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Furnishing` }, {
            transaction: t,
          });
        }

        if (newApartment.available) {
          apartment.available = (newApartment.available).toLowerCase() === "true";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Available` }, {
            transaction: t,
          });
        }

        //TODO: tambahin update lease_term_time, lease_term_type

        if (newApartment.bedroom !== undefined) {
          const bedroom = Number(newApartment.bedroom);
          if (typeof bedroom !== "number") {
            const err = new ErrorDetails("ApartmentError", "bedroom", "bedroom must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.bedroom = bedroom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Bedroom` }, {
            transaction: t,
          });
        }

        if (newApartment.bathroom !== undefined) {
          const bathroom = Number(newApartment.bathroom);
          if (typeof bathroom !== "number") {
            const err = new ErrorDetails("ApartmentError", "bathroom", "bathroom must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.bathroom = bathroom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Bathroom` }, {
            transaction: t,
          });
        }

        if (newApartment.study_room !== undefined) {
          const studyRoom = Number(newApartment.study_room);
          if (typeof studyRoom !== "number") {
            const err = new ErrorDetails("ApartmentError", "study_room", "study_room must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          apartment.study_room = studyRoom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Study Room` }, {
            transaction: t,
          });
        }

        if (newApartment.remarks_1 || newApartment.remarks_1 == "") {
          apartment.remarks_1 = newApartment.remarks_1 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Remarks 1` }, {
            transaction: t,
          });
        }

        if (newApartment.remarks_2 || newApartment.remarks_2 == "") {
          apartment.remarks_2 = newApartment.remarks_2 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Remarks 2` }, {
            transaction: t,
          });
        }

        if (newApartment.remarks_3 || newApartment.remarks_3 == "") {
          apartment.remarks_3 = newApartment.remarks_3 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Remarks 3` }, {
            transaction: t,
          });
        }

        if (newApartment.kode_propar) {
          const pattern = /^[A-Z]{1,7}[0-9]{3}$/;

          if (!pattern.test(newApartment.kode_propar)) {
            const err = new ErrorDetails("ApartmentError", "kode_propar", [
              "total character must not be more than 10",
              "last 3 characters of kode_propar must be digits",
              "the rest of the characters must be capitalized letter",
            ]);

            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingApartment = await Apartment.findOne({ where: { kode_propar: newApartment.kode_propar } });

          if (existingApartment && existingApartment.id !== apartment.id) {
            const err = new ErrorDetails("ApartmentError", "kode_propar", "kode_propar has been taken");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          await Apartment.update({ kode_propar: newApartment.kode_propar }, {
            where: { kode_propar: apartment.kode_propar },
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} Kode Propar to ${newApartment.kode_propar}` }, {
            transaction: t,
          });
        }
      }

      await apartment.save({ transaction: t });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Apartment ${apartment.kode_propar} data` }, {
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

module.exports = updateOrCreateApartmentById;
