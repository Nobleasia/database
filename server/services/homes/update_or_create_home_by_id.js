const fs = require("fs");
const path = require("path");
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const { PropertyFacilityName, PropertyArea, PropertyPersonInChargeRole, PropertyPersonInChargeCompany, PropertyPersonInCharge, PropertyPaymentTerm } = require('../../models/property');
const { Home, HomePhoto, HomeFacility } = require("../../models/home");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const updateOrCreateHomeById = async (req) => {

  if (!req.params.kode_propar) {
    const err = new ErrorDetails("HomeError", "kode_propar", "kode_propar must not be null");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const { fees, facilities, pic, deleted_photo_ids, restored_photo_ids, ...newHome } = req.body;

  const newHomeFees = fees ? JSON.parse(fees) : null;
  const newHomeFacilities = facilities ? JSON.parse(facilities) : null;
  const homePic = pic ? JSON.parse(pic) : null;
  const homePhotos = deleted_photo_ids ? JSON.parse(deleted_photo_ids) : null;
  const restoredPhotos = restored_photo_ids ? JSON.parse(restored_photo_ids) : null;

  try {
    await sequelize.transaction(async (t) => {
      const home = await Home.findByPk(req.params.kode_propar);

      if (!home) {
        const err = new ErrorDetails("HomeError", "kode_propar", "kode_propar not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      if (req.files) {
        const photos = req.files.map(photo => {
          return {
            home_kode_propar: home.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/home/${home.kode_propar}/${photo.filename}`,
          };
        });

        await HomePhoto.bulkCreate(photos, { transaction: t });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Insert new photo in Home ${home.kode_propar} data` }, {
          transaction: t,
        });
      }

      if (newHomeFacilities) {
        if (!(Array.isArray(newHomeFacilities))) {
          const err = new ErrorDetails("HomeFacilityError", "facilities", "facilities must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (newHomeFacilities.length === 0) {
          await HomeFacility.destroy({
            where: {
              home_kode_propar: home.kode_propar,
            },
            force: true,
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Home ${home.kode_propar} Facilities` }, {
            transaction: t,
          });

          return;
        }

        await HomeFacility.destroy({
          where: {
            home_kode_propar: home.kode_propar,
          },
          force: true,
          transaction: t,
        });

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Home ${home.kode_propar} Facilities` }, {
          transaction: t,
        });

        for (const newFacility of newHomeFacilities) {
          const facilityObj = {};

          facilityObj.home_kode_propar = home.kode_propar;

          if (!newFacility.property_facility_name) {
            const err = new ErrorDetails("HomeFacilityError", "property_facility_name", "property_facility_name must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof newFacility.property_facility_name !== "string") {
            const err = new ErrorDetails("HomeFacilityError", "property_facility_name", "property_facility_name must be string");
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

          await HomeFacility.create(facilityObj, { transaction: t });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Facilities` }, {
            transaction: t,
          });
        }
      }

      if (homePhotos) {
        if (!(Array.isArray(homePhotos))) {
          const err = new ErrorDetails("HomePhotoError", "deleted_photo_ids", "deleted_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (homePhotos.length < 1) {
          const err = new ErrorDetails("HomePhotoError", "deleted_photo_ids", "deleted_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of homePhotos) {

          if (!photo.id) {
            const err = new ErrorDetails("HomePhotoError", "id", "deleted_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("HomePhotoError", "id", "deleted_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (photo.force_delete === undefined) {
            const err = new ErrorDetails("HomePhotoError", "force_delete", "force_delete must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.force_delete !== "boolean") {
            const err = new ErrorDetails("HomePhotoError", "force_delete", "force_delete must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await HomePhoto.findOne({
            where: {
              id: photo.id,
              home_kode_propar: home.kode_propar,
            },
            paranoid: !photo.force_delete,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("HomePhotoError", "id", "photo id not found");
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

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Delete ALL Home ${home.kode_propar} photos data` }, {
            transaction: t,
          });
        }
      }

      if (restoredPhotos) {
        if (!(Array.isArray(restoredPhotos))) {
          const err = new ErrorDetails("HomePhotoError", "restored_photo_ids", "restored_photo_ids must be array");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        if (restoredPhotos.length < 1) {
          const err = new ErrorDetails("HomePhotoError", "restored_photo_ids", "restored_photo_ids must have a minimum of 1 item");
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
        }

        for (const photo of restoredPhotos) {
          if (!photo.id) {
            const err = new ErrorDetails("HomePhotoError", "id", "restored_photo_ids id must not be null");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails("HomePhotoError", "id", "restored_photo_ids id must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingPhoto = await HomePhoto.findOne({
            where: {
              id: photo.id,
              home_kode_propar: home.kode_propar,
            },
            paranoid: false,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails("HomePhotoError", "id", "photo id not found");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
          }

          await existingPhoto.restore({ transaction: t });

          await Log.create({ status_code: 200, username: req.username ?? null, message: `Restore Home ${home.kode_propar} Photos` }, {
            transaction: t,
          });
        }
      }

      if (homePic !== null && typeof homePic === "object" && Object.keys(homePic).length !== 0) {
        const where = {};

        if (homePic.fullname) {
          if (typeof homePic.fullname !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "fullname", "fullname must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.fullname = homePic.fullname;
        }

        if (homePic.phone_number) {
          if (typeof homePic.phone_number !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "phone_number", "phone_number must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          where.phone_number = homePic.phone_number;
        }

        if (homePic.role) {
          if (typeof homePic.role !== "string") {
            const err = new ErrorDetails("PropertyPersonInChargeError", "role", "role must be string");
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

          homePic.company_id = await PropertyPersonInChargeCompany.findOrCreate({
            where: { name: homePic.company },
            defaults: { name: homePic.company },
            transaction: t,
          });

          where.property_person_in_charge_company_id = homePic.company_id[0].id;

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

        home.property_person_in_charge_id = existingPIC[0].id;

        if (existingPIC[1]) {
          await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Person In Charge ${homePic.fullname} is CREATED` }, {
            transaction: t,
          });
        } else {
          await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Person In Charge ${homePic.fullname} data` }, {
            transaction: t,
          });
        }

        await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} PIC` }, {
          transaction: t,
        });
      }

      if (newHomeFees !== null && typeof newHomeFees === "object" && Object.keys(newHomeFees).length !== 0) {

        if (newHomeFees.compound_fee !== undefined) {
          const compoundFee = Number(newHomeFees.compound_fee);
          if (typeof compoundFee !== "number") {
            const err = new ErrorDetails("HomeError", "compound_fee", "compound_fee must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.compound_fee = compoundFee;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Compound Fee` }, {
            transaction: t,
          });
        }

        if (newHomeFees.compound_fee_coverage) {
          const compoundFeeCoverage = newHomeFees.compound_fee_coverage;
          if (typeof compoundFeeCoverage !== "string") {
            const err = new ErrorDetails("HomeError", "compound_fee_coverage", "compound_fee_coverage must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(compoundFeeCoverage === "Rupiah" || compoundFeeCoverage === "US Dollar")) {
            const err = new ErrorDetails("HomeError", "compound_fee_coverage", "compound_fee_coverage must be Rupiah or US Dollar");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.compound_fee_coverage = compoundFeeCoverage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Compound Fee Coverage` }, {
            transaction: t,
          });
        }

        if (newHomeFees.price_currency) {
          const priceCurrency = newHomeFees.price_currency;
          if (typeof priceCurrency !== "string") {
            const err = new ErrorDetails("HomeError", "price_currency", "price_currency must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!(priceCurrency === "Rupiah" || priceCurrency === "US Dollar")) {
            const err = new ErrorDetails("HomeError", "price_currency", "price_currency must be Rupiah or US Dollar");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.price_currency = priceCurrency;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Price Currency` }, {
            transaction: t,
          });
        }

        if (newHomeFees.rental_price !== undefined) {
          const rentalPrice = Number(newHomeFees.rental_price);
          if (typeof rentalPrice !== "number") {
            const err = new ErrorDetails("HomeError", "rental_price", "rental_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.rental_price = rentalPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Rental Price` }, {
            transaction: t,
          });
        }

        if (newHomeFees.selling_price !== undefined) {
          const sellingPrice = Number(newHomeFees.selling_price);
          if (typeof sellingPrice !== "number") {
            const err = new ErrorDetails("HomeError", "selling_price", "selling_price must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.selling_price = sellingPrice;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Selling Price` }, {
            transaction: t,
          });
        }

        if (newHomeFees.property_payment_terms_name === "") {
          home.property_payment_term_id = null;
        } else {
          const paymentTermName = newHomeFees.property_payment_terms_name;

          if (typeof paymentTermName !== "string") {
            const err = new ErrorDetails("HomeError", "property_payment_terms_name", "property_payment_terms_name must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const [paymentTerm, isCreated] = await PropertyPaymentTerm.findOrCreate({
            where: { payment_term: paymentTermName },
            defaults: { payment_term: paymentTermName },
            transaction: t,
          });

          home.property_payment_term_id = paymentTerm.id;

          const logMessage = isCreated
            ? `Property Payment Term ${paymentTermName} is CREATED`
            : `Viewing Property Payment Term ${paymentTermName} data`;

          await Log.create({ status_code: isCreated ? 201 : 200, username: req.username ?? null, message: logMessage }, {
            transaction: t,
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Payment Term` }, {
            transaction: t,
          });
        }

        if (newHomeFees.vat_percentage !== undefined) {
          const vatPercentage = Number(newHomeFees.vat_percentage);
          if (typeof vatPercentage !== "number") {
            const err = new ErrorDetails("HomeError", "vat_percentage", "vat_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.vat_percentage = vatPercentage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} VAT Percentage` }, {
            transaction: t,
          });
        }

        if (newHomeFees.vat_is_included) {
          const vatIsIncluded = newHomeFees.vat_is_included;
          if (typeof vatIsIncluded !== "boolean") {
            const err = new ErrorDetails("HomeError", "vat_is_included", "vat_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.vat_is_included = vatIsIncluded;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} VAT is included` }, {
            transaction: t,
          });
        }

        if (newHomeFees.wht_percentage !== undefined) {
          const whtPercentage = Number(newHomeFees.wht_percentage);
          if (typeof whtPercentage !== "number") {
            const err = new ErrorDetails("HomeError", "wht_percentage", "wht_percentage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.wht_percentage = whtPercentage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} WHT Percentage` }, {
            transaction: t,
          });
        }

        if (newHomeFees.wht_is_included) {
          const whtIsIncluded = newHomeFees.wht_is_included;
          if (typeof whtIsIncluded !== "boolean") {
            const err = new ErrorDetails("HomeError", "wht_is_included", "wht_is_included must be boolean");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.wht_is_included = whtIsIncluded;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} WHT is included` }, {
            transaction: t,
          });
        }

        if (newHomeFees.lease_term_time !== undefined) {
          const leaseTermTime = Number(newHomeFees.lease_term_time);
          if (typeof leaseTermTime !== "number") {
            const err = new ErrorDetails("HomeError", "lease_term_time", "lease_term_time must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.lease_term_time = leaseTermTime;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Lease Term Time` }, {
            transaction: t,
          });
        }

        if (newHomeFees.lease_term_type === "") {
          home.lease_term_type = null;
        } else {
          const validLeaseTermTypes = ["Month", "Year"];
          const leaseTermType = newHomeFees.lease_term_type;

          if (typeof leaseTermType !== "string") {
            const err = new ErrorDetails("HomeError", "lease_term_type", "lease_term_type must be a string");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          if (!validLeaseTermTypes.includes(leaseTermType)) {
            const err = new ErrorDetails("HomeError", "lease_term_type", "lease_term_type must be Month or Year");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.lease_term_type = leaseTermType;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Lease Term Type` }, {
            transaction: t,
          });
        }
      }

      if (newHome !== null && typeof newHome === "object" && Object.keys(newHome).length !== 0) {

        if (newHome.name) {
          if (typeof newHome.name !== "string") {
            const err = new ErrorDetails("HomeError", "name", "name must be string");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const pattern = /[^a-zA-Z0-9 ]+/;

          if (pattern.test(newHome.name)) {
            const err = new ErrorDetails("HomeError", "name", "name must not contain special character");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.name = newHome.name;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Name` }, {
            transaction: t,
          });
        }

        if (newHome.address) {
          home.address = newHome.address;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Address` }, {
            transaction: t,
          });
        }

        if (newHome.property_area) {
          const area = await PropertyArea.findOrCreate({
            where: { region_name: newHome.property_area },
            defaults: { region_name: newHome.property_area },
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
            await Log.create({ status_code: 201, username: req.username ?? null, message: `Property Area ${newHome.property_area} is CREATED` }, {
              transaction: t,
            });
          } else {
            await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Area ${newHome.property_area} data` }, {
              transaction: t,
            });
          }

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Area` }, {
            transaction: t,
          });
        }

        if (newHome.land_size !== undefined) {
          const land_size = Number(newHome.land_size);
          if (typeof land_size !== "number") {
            const err = new ErrorDetails("HomeError", "land_size", "land_size must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.land_size = land_size;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Land Size` }, {
            transaction: t,
          });
        }

        if (newHome.building_size !== undefined) {
          const building_size = Number(newHome.building_size);
          if (typeof building_size !== "number") {
            const err = new ErrorDetails("HomeError", "building_size", "building_size must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.building_size = building_size;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Building Size` }, {
            transaction: t,
          });
        }

        if (newHome.stories !== undefined) {
          const stories = Number(newHome.stories);
          if (typeof stories !== "number") {
            const err = new ErrorDetails("HomeError", "stories", "stories must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.stories = stories;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Stories` }, {
            transaction: t,
          });
        }

        if (newHome.furnishing !== undefined && newHome.furnishing !== null) {
          home.furnishing = null;
        } else {
          const validFurnishingOptions = ["Unfurnished", "Semi Furnished", "Fully Furnished"];
          const furnishing = newHome.furnishing;

          if (!validFurnishingOptions.includes(furnishing)) {
            const err = new ErrorDetails("HomeError", "furnishing", "Invalid furnishing value");
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.furnishing = furnishing;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Furnishing` }, {
            transaction: t,
          });
        }

        if (newHome.available) {
          home.available = (newHome.available).toLowerCase() === "true";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Available` }, {
            transaction: t,
          });
        }

        if (newHome.bedroom !== undefined) {
          const bedroom = Number(newHome.bedroom);
          if (typeof bedroom !== "number") {
            const err = new ErrorDetails("HomeError", "bedroom", "bedroom must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.bedroom = bedroom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Bedroom` }, {
            transaction: t,
          });
        }

        if (newHome.bathroom !== undefined) {
          const bathroom = Number(newHome.bathroom);
          if (typeof bathroom !== "number") {
            const err = new ErrorDetails("HomeError", "bathroom", "bathroom must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.bathroom = bathroom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Bathroom` }, {
            transaction: t,
          });
        }

        if (newHome.study_room !== undefined) {
          const studyRoom = Number(newHome.study_room);
          if (typeof studyRoom !== "number") {
            const err = new ErrorDetails("HomeError", "study_room", "study_room must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.study_room = studyRoom;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Study Room` }, {
            transaction: t,
          });
        }

        if (newHome.carport_or_garage !== undefined) {
          const carportOrGarage = Number(newHome.carport_or_garage);
          if (typeof carportOrGarage !== "number") {
            const err = new ErrorDetails("HomeError", "carport_or_garage", "carport_or_garage must be integer");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.carport_or_garage = carportOrGarage;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Carport or Garage` }, {
            transaction: t,
          });
        }

        if (newHome.backyard) {
          home.backyard = (newHome.backyard).toLowerCase() === "true";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Backyard` }, {
            transaction: t,
          });
        }

        if (newHome.swimming_pool) {
          home.swimming_pool = (newHome.swimming_pool).toLowerCase() === "true";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Swimming Pool` }, {
            transaction: t,
          });
        }

        if (newHome.house_type) {
          const { house_type } = newHome;
          if (!(house_type === "Compound" || house_type === "Standalone")) {
            const err = new ErrorDetails("HomeError", "house_type", "invalid value");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          home.house_type = house_type;

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} House Type` }, {
            transaction: t,
          });
        }

        if (newHome.remarks_1 || newHome.remarks_1 == "") {
          home.remarks_1 = newHome.remarks_1 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Remarks 1` }, {
            transaction: t,
          });
        }

        if (newHome.remarks_2 || newHome.remarks_2 == "") {
          home.remarks_2 = newHome.remarks_2 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Remarks 2` }, {
            transaction: t,
          });
        }

        if (newHome.remarks_3 || newHome.remarks_3 == "") {
          home.remarks_3 = newHome.remarks_3 ?? "No Remark";

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Remarks 3` }, {
            transaction: t,
          });
        }

        if (newHome.kode_propar) {
          const pattern = /^[A-Z]{1,7}[0-9]{3}$/;

          if (!pattern.test(newHome.kode_propar)) {
            const err = new ErrorDetails("HomeError", "kode_propar", [
              "total character must not be more than 10",
              "last 3 characters of kode_propar must be digits",
              "the rest of the characters must be capitalized letter",
            ]);

            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          const existingHome = await Home.findOne({ where: { kode_propar: newHome.kode_propar } });

          if (existingHome && existingHome.id !== home.id) {
            const err = new ErrorDetails("HomeError", "kode_propar", "kode_propar has been taken");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
          }

          await Home.update({ kode_propar: newHome.kode_propar }, {
            where: { kode_propar: home.kode_propar },
          });

          await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} Kode Propar to ${newHome.kode_propar}` }, {
            transaction: t,
          });
        }
      }

      await home.save({ transaction: t });

      await Log.create({ status_code: 204, username: req.username ?? null, message: `Update Home ${home.kode_propar} data` }, {
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

module.exports = updateOrCreateHomeById;
