const fs = require("fs");
const path = require("path");
const Log = require("../../models/log");
const { sequelize } = require("../../utils/db");
const {
  PropertyArea,
  PropertyPersonInChargeRole,
  PropertyPersonInChargeCompany,
  PropertyPersonInCharge,
  PropertyPaymentTerm,
} = require("../../models/property");
const { Land, LandPhoto } = require("../../models/land");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const updateOrCreateLandById = async (req) => {
  if (!req.params.kode_propar) {
    const err = new ErrorDetails(
      "LandError",
      "kode_propar",
      "kode_propar must not be null",
    );
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", {
      [err.attribute]: err.message,
    });
  }

  const { fees, pic, deleted_photo_ids, restored_photo_ids, ...newLand } =
    req.body;

  const newLandFees = fees ? JSON.parse(fees) : null;
  const landPic = pic ? JSON.parse(pic) : null;
  const landPhotos = deleted_photo_ids ? JSON.parse(deleted_photo_ids) : null;
  const restoredPhotos = restored_photo_ids
    ? JSON.parse(restored_photo_ids)
    : null;

  try {
    await sequelize.transaction(async (t) => {
      const land = await Land.findByPk(req.params.kode_propar);

      if (!land) {
        const err = new ErrorDetails(
          "LandError",
          "kode_propar",
          "kode_propar not found",
        );
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", {
          [err.attribute]: err.message,
        });
      }

      if (req.files) {
        const photos = req.files.map((photo) => {
          return {
            land_kode_propar: land.kode_propar,
            photo_path: photo.path,
            photo_url: `/static/land/${land.kode_propar}/${photo.filename}`,
          };
        });

        await LandPhoto.bulkCreate(photos, { transaction: t });
      }

      if (landPhotos) {
        if (!Array.isArray(landPhotos)) {
          const err = new ErrorDetails(
            "LandPhotoError",
            "deleted_photo_ids",
            "deleted_photo_ids must be array",
          );
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", {
            [err.attribute]: err.message,
          });
        }

        if (landPhotos.length < 1) {
          const err = new ErrorDetails(
            "LandPhotoError",
            "deleted_photo_ids",
            "deleted_photo_ids must have a minimum of 1 item",
          );
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", {
            [err.attribute]: err.message,
          });
        }

        for (const photo of landPhotos) {
          if (!photo.id) {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "deleted_photo_ids id must not be null",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "deleted_photo_ids id must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (photo.force_delete === undefined) {
            const err = new ErrorDetails(
              "LandPhotoError",
              "force_delete",
              "force_delete must not be null",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (typeof photo.force_delete !== "boolean") {
            const err = new ErrorDetails(
              "LandPhotoError",
              "force_delete",
              "force_delete must be boolean",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          const existingPhoto = await LandPhoto.findOne({
            where: {
              id: photo.id,
              land_kode_propar: land.kode_propar,
            },
            paranoid: !photo.force_delete,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "photo id not found",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", {
              [err.attribute]: err.message,
            });
          }

          const { photo_path } = existingPhoto;

          await existingPhoto.destroy({
            force: photo.force_delete,
            transaction: t,
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
        }
      }

      if (restoredPhotos) {
        if (!Array.isArray(restoredPhotos)) {
          const err = new ErrorDetails(
            "LandPhotoError",
            "restored_photo_ids",
            "restored_photo_ids must be array",
          );
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", {
            [err.attribute]: err.message,
          });
        }

        if (restoredPhotos.length < 1) {
          const err = new ErrorDetails(
            "LandPhotoError",
            "restored_photo_ids",
            "restored_photo_ids must have a minimum of 1 item",
          );
          // TODO: ganti console ke log kalau sudah mau production
          console.error(err);
          throw new ErrorResponse(400, "BAD_REQUEST", {
            [err.attribute]: err.message,
          });
        }

        for (const photo of restoredPhotos) {
          if (!photo.id) {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "restored_photo_ids id must not be null",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (typeof photo.id !== "number") {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "restored_photo_ids id must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          const existingPhoto = await LandPhoto.findOne({
            where: {
              id: photo.id,
              land_kode_propar: land.kode_propar,
            },
            paranoid: false,
          });

          if (!existingPhoto) {
            const err = new ErrorDetails(
              "LandPhotoError",
              "id",
              "photo id not found",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", {
              [err.attribute]: err.message,
            });
          }

          await existingPhoto.restore({ transaction: t });
        }
      }

      if (
        landPic !== null &&
        typeof landPic === "object" &&
        Object.keys(landPic).length !== 0
      ) {
        const where = {};

        if (landPic.fullname) {
          if (typeof landPic.fullname !== "string") {
            const err = new ErrorDetails(
              "PropertyPersonInChargeError",
              "fullname",
              "fullname must be string",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          where.fullname = landPic.fullname;
        }

        if (landPic.phone_number) {
          if (typeof landPic.phone_number !== "string") {
            const err = new ErrorDetails(
              "PropertyPersonInChargeError",
              "phone_number",
              "phone_number must be string",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          where.phone_number = landPic.phone_number;
        }

        if (landPic.role) {
          if (typeof landPic.role !== "string") {
            const err = new ErrorDetails(
              "PropertyPersonInChargeError",
              "role",
              "role must be string",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          landPic.role_id = await PropertyPersonInChargeRole.findOrCreate({
            where: { name: landPic.role },
            defaults: { name: landPic.role },
            transaction: t,
          });

          where.property_person_in_charge_role_id = landPic.role_id[0].id;

          if (landPic.role_id[1]) {
            await Log.create(
              {
                status_code: 201,
                username: req.username ?? null,
                message: `Property Person In Charge Role ${landPic.role} is CREATED`,
              },
              {
                transaction: t,
              },
            );
          } else {
            await Log.create(
              {
                status_code: 200,
                username: req.username ?? null,
                message: `Viewing Property Person In Charge Role ${landPic.role} data`,
              },
              {
                transaction: t,
              },
            );
          }
        }

        if (landPic.company) {
          if (typeof landPic.company !== "string") {
            const err = new ErrorDetails(
              "PropertyPersonInChargeError",
              "company",
              "company must be string",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          landPic.company_id = await PropertyPersonInChargeCompany.findOrCreate(
            {
              where: { name: landPic.company },
              defaults: { name: landPic.company },
              transaction: t,
            },
          );

          where.property_person_in_charge_company_id = landPic.company_id[0].id;

          if (landPic.company_id[1]) {
            await Log.create(
              {
                status_code: 201,
                username: req.username ?? null,
                message: `Property Person In Charge Company ${landPic.company} is CREATED`,
              },
              {
                transaction: t,
              },
            );
          } else {
            await Log.create(
              {
                status_code: 200,
                username: req.username ?? null,
                message: `Viewing Property Person In Charge Company ${landPic.company} data`,
              },
              {
                transaction: t,
              },
            );
          }
        }

        const existingPIC = await PropertyPersonInCharge.findOrCreate({
          where,
          defaults: where,
          transaction: t,
        });

        land.property_person_in_charge_id = existingPIC[0].id;

        if (existingPIC[1]) {
          await Log.create(
            {
              status_code: 201,
              username: req.username ?? null,
              message: `Property Person In Charge ${landPic.fullname} is CREATED`,
            },
            {
              transaction: t,
            },
          );
        } else {
          await Log.create(
            {
              status_code: 200,
              username: req.username ?? null,
              message: `Viewing Property Person In Charge ${landPic.fullname} data`,
            },
            {
              transaction: t,
            },
          );
        }

        await Log.create(
          {
            status_code: 204,
            username: req.username ?? null,
            message: `Update Land ${land.kode_propar} PIC`,
          },
          {
            transaction: t,
          },
        );
      }

      if (
        newLandFees !== null &&
        typeof newLandFees === "object" &&
        Object.keys(newLandFees).length !== 0
      ) {
        if (newLandFees.price_currency) {
          const priceCurrency = newLandFees.price_currency;
          if (typeof priceCurrency !== "string") {
            const err = new ErrorDetails(
              "LandError",
              "price_currency",
              "price_currency must be string",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (!(priceCurrency === "Rupiah" || priceCurrency === "US Dollar")) {
            const err = new ErrorDetails(
              "LandError",
              "price_currency",
              "price_currency must be Rupiah or US Dollar",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.price_currency = priceCurrency;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Price Currency`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.price !== undefined) {
          const rentalPrice = Number(newLandFees.price);
          if (typeof rentalPrice !== "number") {
            const err = new ErrorDetails(
              "LandError",
              "price",
              "price must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.price = rentalPrice;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Rental Price`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.property_payment_terms_name === "") {
          land.property_payment_term_id = null;
        } else {
          const paymentTermName = newLandFees.property_payment_terms_name;

          if (typeof paymentTermName !== "string") {
            const err = new ErrorDetails(
              "LandError",
              "property_payment_terms_name",
              "property_payment_terms_name must be a string",
            );
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          const [paymentTerm, isCreated] =
            await PropertyPaymentTerm.findOrCreate({
              where: { payment_term: paymentTermName },
              defaults: { payment_term: paymentTermName },
              transaction: t,
            });

          land.property_payment_term_id = paymentTerm.id;

          const logMessage = isCreated
            ? `Property Payment Term ${paymentTermName} is CREATED`
            : `Viewing Property Payment Term ${paymentTermName} data`;

          await Log.create(
            {
              status_code: isCreated ? 201 : 200,
              username: req.username ?? null,
              message: logMessage,
            },
            {
              transaction: t,
            },
          );

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Payment Term`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.vat_percentage !== undefined) {
          const vatPercentage = Number(newLandFees.vat_percentage);
          if (typeof vatPercentage !== "number") {
            const err = new ErrorDetails(
              "LandError",
              "vat_percentage",
              "vat_percentage must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.vat_percentage = vatPercentage;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} VAT Percentage`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.vat_is_included) {
          const vatIsIncluded = newLandFees.vat_is_included;
          if (typeof vatIsIncluded !== "boolean") {
            const err = new ErrorDetails(
              "LandError",
              "vat_is_included",
              "vat_is_included must be boolean",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.vat_is_included = vatIsIncluded;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} VAT is included`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.wht_percentage !== undefined) {
          const whtPercentage = Number(newLandFees.wht_percentage);
          if (typeof whtPercentage !== "number") {
            const err = new ErrorDetails(
              "LandError",
              "wht_percentage",
              "wht_percentage must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.wht_percentage = whtPercentage;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} WHT Percentage`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.wht_is_included) {
          const whtIsIncluded = newLandFees.wht_is_included;
          if (typeof whtIsIncluded !== "boolean") {
            const err = new ErrorDetails(
              "LandError",
              "wht_is_included",
              "wht_is_included must be boolean",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.wht_is_included = whtIsIncluded;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} VAT is included`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.lease_term_time !== undefined) {
          const leaseTermTime = Number(newLandFees.lease_term_time);
          if (typeof leaseTermTime !== "number") {
            const err = new ErrorDetails(
              "LandError",
              "lease_term_time",
              "lease_term_time must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.lease_term_time = leaseTermTime;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Lease Term Time`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLandFees.lease_term_type === "") {
          land.lease_term_type = null;
        } else {
          const validLeaseTermTypes = ["Month", "Year"];
          const leaseTermType = newLandFees.lease_term_type;

          if (typeof leaseTermType !== "string") {
            const err = new ErrorDetails(
              "LandError",
              "lease_term_type",
              "lease_term_type must be a string",
            );
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          if (!validLeaseTermTypes.includes(leaseTermType)) {
            const err = new ErrorDetails(
              "LandError",
              "lease_term_type",
              "lease_term_type must be Month or Year",
            );
            // TODO: Ganti console.log ke log kalau sudah dalam mode production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.lease_term_type = leaseTermType;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Lease Term Type`,
            },
            {
              transaction: t,
            },
          );
        }
      }

      if (
        newLand !== null &&
        typeof newLand === "object" &&
        Object.keys(newLand).length !== 0
      ) {
        if (newLand.address) {
          land.address = newLand.address;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Address`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.property_area) {
          const area = await PropertyArea.findOrCreate({
            where: { region_name: newLand.property_area },
            defaults: { region_name: newLand.property_area },
            transaction: t,
          });

          if (!area) {
            const err = new ErrorDetails(
              "LandError",
              "property_area",
              "property_area invalid region_name",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(404, "NOT_FOUND", {
              [err.attribute]: err.message,
            });
          }

          land.property_area_id = area[0].id;

          if (area[1]) {
            await Log.create(
              {
                status_code: 201,
                username: req.username ?? null,
                message: `Property Area ${newLand.property_area} is CREATED`,
              },
              {
                transaction: t,
              },
            );
          } else {
            await Log.create(
              {
                status_code: 200,
                username: req.username ?? null,
                message: `Viewing Property Area ${newLand.property_area} data`,
              },
              {
                transaction: t,
              },
            );
          }

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Area`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.land_size !== undefined) {
          const land_size = Number(newLand.land_size);
          if (typeof land_size !== "number") {
            const err = new ErrorDetails(
              "LandError",
              "land_size",
              "land_size must be integer",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.land_size = land_size;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Land Size`,
            },
            {
              transaction: t,
            },
          );
        }

        if (typeof newLand.ownership === "string") {
          land.ownership = newLand.ownership;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Ownership`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.zone) {
          const { zone } = newLand;
          if (!(zone === "Red" || zone === "Yellow" || zone === "Green")) {
            const err = new ErrorDetails("LandError", "zone", "invalid value");
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          land.zone = zone;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Zone`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.available) {
          land.available = newLand.available.toLowerCase() === "true";

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Available`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.surroundings) {
          land.surroundings = newLand.surroundings;

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Surroundings`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.remarks_1 || newLand.remarks_1 == "") {
          land.remarks_1 = newLand.remarks_1 ?? "No Remark";

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Remarks 1`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.remarks_2 || newLand.remarks_2 == "") {
          land.remarks_2 = newLand.remarks_2 ?? "No Remark";

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Remarks 2`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.remarks_3 || newLand.remarks_3 == "") {
          land.remarks_3 = newLand.remarks_3 ?? "No Remark";

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Remarks 3`,
            },
            {
              transaction: t,
            },
          );
        }

        if (newLand.kode_propar) {
          const pattern = /^[A-Z]{1,7}[0-9]{3}$/;

          if (!pattern.test(newLand.kode_propar)) {
            const err = new ErrorDetails("LandError", "kode_propar", [
              "total character must not be more than 10",
              "last 3 characters of kode_propar must be digits",
              "the rest of the characters must be capitalized letter",
            ]);

            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          const existingLand = await Land.findOne({
            where: { kode_propar: newLand.kode_propar },
          });

          if (existingLand && existingLand.id !== land.id) {
            const err = new ErrorDetails(
              "LandError",
              "kode_propar",
              "kode_propar has been taken",
            );
            // TODO: ganti console ke log kalau sudah mau production
            console.error(err);
            throw new ErrorResponse(400, "BAD_REQUEST", {
              [err.attribute]: err.message,
            });
          }

          await Land.update(
            { kode_propar: newLand.kode_propar },
            {
              where: { kode_propar: land.kode_propar },
            },
          );

          await Log.create(
            {
              status_code: 204,
              username: req.username ?? null,
              message: `Update Land ${land.kode_propar} Kode Propar to ${newLand.kode_propar}`,
            },
            {
              transaction: t,
            },
          );
        }
      }

      await land.save({ transaction: t });

      await Log.create(
        {
          status_code: 204,
          username: req.username ?? null,
          message: `Update Land ${land.kode_propar} data`,
        },
        {
          transaction: t,
        },
      );
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
};

module.exports = updateOrCreateLandById;
