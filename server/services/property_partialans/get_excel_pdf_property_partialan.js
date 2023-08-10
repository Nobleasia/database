const { Op } = require('sequelize');

const Log = require("../../models/log");
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../models/apartment");
const { Home, HomePhoto, HomeFacility } = require("../../models/home");
const { Land, LandPhoto } = require("../../models/land");
const { Office, OfficePhoto, OfficeFacility } = require("../../models/office");
const { PropertyArea, PropertyFacilityName, PropertyPaymentTerm } = require("../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const getExcelPdfPropertyPartialan = async (req) => {
  const { body } = req;

  if (!body) {
    const err = new ErrorDetails("PropertyPartialanError", "request body", "request body must not be empty");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (!Array.isArray(body)) {
    const err = new ErrorDetails("PropertyPartialanError", "request body", "request body must be an array of object");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  let include = [];
  const propertyData = [];

  for (const data of body) {
    const { property_type, kode_propar, photos_id, facilities_id, area_id, payment_term_id, selected_property_data } = data;

    if (!((property_type === "Apartment") || (property_type === "Home") || (property_type === "Land") || (property_type === "Office"))) {
      const err = new ErrorDetails("PropertyPartialanError", "property_type", "property_type must be Apartment or Home or Land or Office");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (!kode_propar) {
      const err = new ErrorDetails("PropertyPartialanError", "kode_propar", "kode_propar must not be empty");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (!area_id) {
      const err = new ErrorDetails("PropertyPartialanError", "area_id", "area_id must not be empty");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (typeof area_id !== "number") {
      const err = new ErrorDetails("PropertyPartialanError", "area_id", "area_id must be number");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    include.push({
      model: PropertyArea,
      as: "property_area",
      attributes: ['id', 'region_name'],
      where: { id: { [Op.eq]: area_id } },
    });

    if (photos_id) {
      if (!(Array.isArray(photos_id))) {
        const err = new ErrorDetails("PropertyPartialanError", "photos_id", "photos_id must be array of number");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (property_type === "Apartment") {
        include.push({
          model: ApartmentPhoto,
          as: "photos",
          separate: true,
          attributes: ['id', 'photo_path', 'photo_url'],
          where: { id: { [Op.in]: photos_id } },
          order: [['id', 'ASC']],
        });
      }

      if (property_type === "Home") {
        include.push({
          model: HomePhoto,
          as: "photos",
          separate: true,
          attributes: ['id', 'photo_path', 'photo_url'],
          where: { id: { [Op.in]: photos_id } },
          order: [['id', 'ASC']],
        });
      }

      if (property_type === "Land") {
        include.push({
          model: LandPhoto,
          as: "photos",
          separate: true,
          attributes: ['id', 'photo_path', 'photo_url'],
          where: { id: { [Op.in]: photos_id } },
          order: [['id', 'ASC']],
        });
      }

      if (property_type === "Office") {
        include.push({
          model: OfficePhoto,
          as: "photos",
          separate: true,
          attributes: ['id', 'photo_path', 'photo_url'],
          where: { id: { [Op.in]: photos_id } },
          order: [['id', 'ASC']],
        });
      }
    }

    if (facilities_id) {
      if (!(Array.isArray(facilities_id))) {
        const err = new ErrorDetails("PropertyPartialanError", "facilities_id", "facilities_id must be array of number");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      if (property_type === "Apartment") {
        include.push({
          model: ApartmentFacility,
          as: "facilities",
          separate: true,
          attributes: [
            'id',
          ],
          where: { id: { [Op.in]: facilities_id } },
          include: {
            model: PropertyFacilityName,
            as: "property_facility_name",
            attributes: ['id', 'facility_name'],
          },
        });
      }

      if (property_type === "Home") {
        include.push({
          model: HomeFacility,
          as: "facilities",
          separate: true,
          attributes: [
            'id',
          ],
          where: { id: { [Op.in]: facilities_id } },
          include: {
            model: PropertyFacilityName,
            as: "property_facility_name",
            attributes: ['id', 'facility_name'],
          },
        });
      }

      if (property_type === "Office") {
        include.push({
          model: OfficeFacility,
          as: "facilities",
          separate: true,
          attributes: [
            'id',
          ],
          where: { id: { [Op.in]: facilities_id } },
          include: {
            model: PropertyFacilityName,
            as: "property_facility_name",
            attributes: ['id', 'facility_name'],
          },
        });
      }
    }

    if (payment_term_id) {
      if (typeof payment_term_id !== "number") {
        const err = new ErrorDetails("PropertyPartialanError", "payment_term_id", "payment_term_id must be number");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      include.push({
        model: PropertyPaymentTerm,
        as: "property_payment_term",
        attributes: ['id', 'payment_term'],
        where: { id: { [Op.eq]: payment_term_id } },
      });
    }

    if (!(Array.isArray(selected_property_data))) {
      const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "selected_property_data must be array");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (selected_property_data.length < 1) {
      const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "selected_property_data must have a minimum of one item");
      // TODO: ganti console ke log kalau sudah mau production
      console.error(err);
      throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
    }

    if (property_type === "Apartment") {
      const required_selected_property_data = ["name", "address", "rental_price", "selling_price", "available", "furnishing"]

      const missing_required_selected_property_data = required_selected_property_data.every(value => !selected_property_data.includes(value));

      if (missing_required_selected_property_data) {
        const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "name, address, rental_price, selling_price, available, furnishing must not be empty");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      selected_property_data.push("kode_propar");

      if (selected_property_data.includes("vat_details")) {
        selected_property_data.push("vat_percentage", "vat_is_included");
      }

      if (selected_property_data.includes("wht_details")) {
        selected_property_data.push("wht_percentage", "wht_is_included");
      }

      if (selected_property_data.includes("lease_term_details")) {
        selected_property_data.push("lease_term_time", "lease_term_type");
      }

      const apartment = await Apartment.findByPk(kode_propar, {
        attributes: selected_property_data,
        include,
      });

      if (!apartment) {
        const err = new ErrorDetails("PropertyPartialanError", "apartment", "apartment not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      propertyData.push(apartment);

      include = [];
    }

    if (property_type === "Home") {
      const required_selected_property_data = ["name", "address", "rental_price", "selling_price", "available", "furnishing"]

      const missing_required_selected_property_data = required_selected_property_data.every(value => !selected_property_data.includes(value));

      if (missing_required_selected_property_data) {
        const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "name, address, rental_price, selling_price, available, furnishing must not be empty");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      selected_property_data.push("kode_propar");

      if (selected_property_data.includes("vat_details")) {
        selected_property_data.push("vat_percentage", "vat_is_included");
      }

      if (selected_property_data.includes("wht_details")) {
        selected_property_data.push("wht_percentage", "wht_is_included");
      }

      if (selected_property_data.includes("lease_term_details")) {
        selected_property_data.push("lease_term_time", "lease_term_type");
      }

      const home = await Home.findByPk(kode_propar, {
        attributes: selected_property_data,
        include,
      });

      if (!home) {
        const err = new ErrorDetails("PropertyPartialanError", "home", "home not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      propertyData.push(home);

      include = [];
    }

    if (property_type === "Land") {
      const required_selected_property_data = ["address", "price", "available", "ownership"]

      const missing_required_selected_property_data = required_selected_property_data.every(value => !selected_property_data.includes(value));

      if (missing_required_selected_property_data) {
        const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "address, price, available, ownership must not be empty");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      selected_property_data.push("kode_propar");

      if (selected_property_data.includes("vat_details")) {
        selected_property_data.push("vat_percentage", "vat_is_included");
      }

      if (selected_property_data.includes("wht_details")) {
        selected_property_data.push("wht_percentage", "wht_is_included");
      }

      if (selected_property_data.includes("lease_term_details")) {
        selected_property_data.push("lease_term_time", "lease_term_type");
      }

      const land = await Land.findByPk(kode_propar, {
        attributes: selected_property_data,
        include,
      });

      if (!land) {
        const err = new ErrorDetails("PropertyPartialanError", "land", "land not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      propertyData.push(land);

      include = [];
    }

    if (property_type === "Office") {
      const required_selected_property_data = ["name", "address", "rental_price", "selling_price", "available", "condition"]

      const missing_required_selected_property_data = required_selected_property_data.every(value => !selected_property_data.includes(value));

      if (missing_required_selected_property_data) {
        const err = new ErrorDetails("PropertyPartialanError", "selected_property_data", "name, address, rental_price, selling_price, available, condition must not be empty");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }

      selected_property_data.push("kode_propar");

      if (selected_property_data.includes("service_charge_details")) {
        selected_property_data.push("service_charge_price", "service_charge_time");
      }

      if (selected_property_data.includes("overtime_details")) {
        selected_property_data.push("overtime_price", "overtime_time");
      }

      if (selected_property_data.includes("vat_details")) {
        selected_property_data.push("vat_percentage", "vat_is_included");
      }

      if (selected_property_data.includes("wht_details")) {
        selected_property_data.push("wht_percentage", "wht_is_included");
      }

      if (selected_property_data.includes("lease_term_details")) {
        selected_property_data.push("lease_term_time", "lease_term_type");
      }

      const office = await Office.findByPk(kode_propar, {
        attributes: selected_property_data,
        include,
      });

      if (!office) {
        const err = new ErrorDetails("PropertyPartialanError", "office", "office not found");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
      }

      propertyData.push(office);

      include = [];
    }

    await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing ${property_type} ${kode_propar} data for Excel/PDF Property Partialan` });
  }

  if (propertyData.length < 1) {
    const err = new ErrorDetails("PropertyPartialanError", "property_data", "property_data not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  return propertyData;
}

module.exports = getExcelPdfPropertyPartialan;
