const { Op } = require('sequelize');

const Log = require("../../../models/log");
const { Apartment, ApartmentPhoto, ApartmentFacility } = require("../../../models/apartment");
const { PropertyArea, PropertyPersonInCharge, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../../models/response");

const getAllApartments = async (req) => {
  const apartmentWhere = {};

  const apartmentOrder = [];

  // query kode_propar
  if (req.query.kode_propar) {
    if (req.query.kode_propar === 'ASC') {
      apartmentOrder.push(['kode_propar', 'ASC']);
    } else if (req.query.kode_propar === 'DESC') {
      apartmentOrder.push(['kode_propar', 'DESC']);
    } else {
      apartmentWhere.kode_propar = { [Op.like]: `%${req.query.kode_propar}%` };
    }
  }

  // query name
  if (req.query.name) {
    if (req.query.name === 'ASC') {
      apartmentOrder.push(['name', 'ASC']);
    } else if (req.query.name === 'DESC') {
      apartmentOrder.push(['name', 'DESC']);
    } else {
      apartmentWhere.name = { [Op.like]: `%${req.query.name}%` };
    }
  }

  // query address
  if (req.query.address) {
    if (req.query.address === 'ASC') {
      apartmentOrder.push(['address', 'ASC']);
    } else if (req.query.address === 'DESC') {
      apartmentOrder.push(['address', 'DESC']);
    } else {
      apartmentWhere.address = { [Op.like]: `%${req.query.address}%` };
    }
  }

  // query size
  if (req.query.apartment_size === 'ASC') {
    apartmentOrder.push(['size', 'ASC']);
  }

  if (req.query.apartment_size === 'DESC') {
    apartmentOrder.push(['size', 'DESC']);
  }

  if (req.query.size_from && Number(req.query.size_from)) {
    apartmentWhere.size = { [Op.between]: [Number(req.query.size_from), req.query.size_to ? Number(req.query.size_to) ? Number(req.query.size_to) : Number(req.query.size_from) : Number(req.query.size_from)] };
  }

  // query floor
  if (req.query.tower) {
    if (req.query.tower === 'ASC') {
      apartmentOrder.push(['tower', 'ASC']);
    } else if (req.query.tower === 'DESC') {
      apartmentOrder.push(['tower', 'DESC']);
    } else {
      apartmentWhere.tower = { [Op.like]: `%${req.query.tower}%` };
    }
  }

  // query floor
  if (req.query.floor) {
    if (req.query.floor === 'ASC') {
      apartmentOrder.push(['floor', 'ASC']);
    } else if (req.query.floor === 'DESC') {
      apartmentOrder.push(['floor', 'DESC']);
    } else {
      apartmentWhere.floor = { [Op.like]: `%${req.query.floor}%` };
    }
  }

  // query furnishing
  if (req.query.furnishing) {
    if (req.query.furnishing === 'ASC') {
      apartmentOrder.push(['furnishing', 'ASC']);
    } else if (req.query.furnishing === 'DESC') {
      apartmentOrder.push(['furnishing', 'DESC']);
    } else {
      apartmentWhere.furnishing = `${req.query.furnishing}`;
    }
  }

  // query available
  if (req.query.available) {
    if (req.query.available === 'ASC') {
      apartmentOrder.push(['available', 'ASC']);
    } else if (req.query.available === 'DESC') {
      apartmentOrder.push(['available', 'DESC']);
    } else {
      apartmentWhere.available = { [Op.eq]: `${req.query.available}` === 'Yes' };
    }
  };

  const propertyFacilityNameWhere = {};

  const propertyFacilityOrder = [];

  // query facility_name
  if (req.query.facility_name) {
    if (req.query.facility_name === 'ASC') {
      propertyFacilityOrder.push(['facility_name', 'ASC']);
    } else if (req.query.facility_name === 'DESC') {
      propertyFacilityOrder.push(['facility_name', 'DESC']);
    } else {
      propertyFacilityNameWhere.facility_name = { [Op.like]: `%${req.query.facility_name}%` };
    }
  }

  const apartmentPhotoWhere = {};

  // query id foto
  if (req.query.photo_ids) {
    apartmentPhotoWhere.id = {
      [Op.or]: req.query.photo_ids.split(",").map(id => {
        if (parseInt(id)) {
          return parseInt(id)
        }

        const err = new ErrorDetails("ApartmentError", "photo_ids", "photo_ids must be integer");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }),
    };
  }

  const propertyAreaWhere = {};

  const propertyAreaOrder = [];

  // query area
  if (req.query.area) {
    if (req.query.area === 'ASC') {
      propertyAreaOrder.push(['region_name', 'ASC']);
    } else if (req.query.area === 'DESC') {
      propertyAreaOrder.push(['region_name', 'DESC']);
    } else {
      propertyAreaWhere.region_name = { [Op.like]: `%${req.query.area}%` };
    }
  }

  // query rental price
  if (req.query.rental_price === 'ASC') {
    apartmentOrder.push(['rental_price', 'ASC']);
  }

  if (req.query.rental_price === 'DESC') {
    apartmentOrder.push(['rental_price', 'DESC']);
  }

  if (req.query.rental_price_from && Number(req.query.rental_price_from) >= 0) {
    apartmentWhere.rental_price = { [Op.between]: [Number(req.query.rental_price_from), req.query.rental_price_to ? Number(req.query.rental_price_to) ? Number(req.query.rental_price_to) : Number(req.query.rental_price_from) : Number(req.query.rental_price_from)] };
  }

  // query selling price
  if (req.query.selling_price === 'ASC') {
    apartmentOrder.push(['selling_price', 'ASC']);
  }

  if (req.query.selling_price === 'DESC') {
    apartmentOrder.push(['selling_price', 'DESC']);
  }

  if (req.query.selling_price_from && Number(req.query.selling_price_from) >= 0) {
    apartmentWhere.selling_price = { [Op.between]: [Number(req.query.selling_price_from), req.query.selling_price_to ? Number(req.query.selling_price_to) ? Number(req.query.selling_price_to) : Number(req.query.selling_price_from) : Number(req.query.selling_price_from)] };
  }

  // query price currency
  if (req.query.price_currency) {
    if (req.query.price_currency === 'ASC') {
      apartmentOrder.push(['price_currency', 'ASC']);
    } else if (req.query.price_currency === 'DESC') {
      apartmentOrder.push(['price_currency', 'DESC']);
    } else {
      apartmentWhere.price_currency = { [Op.eq]: `${req.query.price_currency}` };
    }
  }

  // query lease term
  if (req.query.lease_term_time === 'ASC') {
    apartmentOrder.push(['lease_term_time', 'ASC']);
  }

  if (req.query.lease_term_time === 'DESC') {
    apartmentOrder.push(['lease_term_time', 'DESC']);
  }

  if (req.query.lease_term_time_from && Number(req.query.lease_term_time_from) >= 0) {
    apartmentWhere.lease_term_time = { [Op.between]: [Number(req.query.lease_term_time_from), req.query.lease_term_time_to ? Number(req.query.lease_term_time_to) ? Number(req.query.lease_term_time_to) : Number(req.query.lease_term_time_from) : Number(req.query.lease_term_time_from)] };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Month") {
    apartmentWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Year") {
    apartmentWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  // query bedroom
  if (req.query.bedroom_from && Number(req.query.bedroom_from) >= 0) {
    apartmentWhere.bedroom_time = { [Op.between]: [Number(req.query.bedroom_from), req.query.bedroom_to ? Number(req.query.bedroom_to) ? Number(req.query.bedroom_to) : Number(req.query.bedroom_from) : Number(req.query.bedroom_from)] };
  }

  // query bathroom
  if (req.query.bathroom_from && Number(req.query.bathroom_from) >= 0) {
    apartmentWhere.bathroom_time = { [Op.between]: [Number(req.query.bathroom_from), req.query.bathroom_to ? Number(req.query.bathroom_to) ? Number(req.query.bathroom_to) : Number(req.query.bathroom_from) : Number(req.query.bathroom_from)] };
  }

  // query study room
  if (req.query.study_room_from && Number(req.query.study_room_from) >= 0) {
    apartmentWhere.study_room_time = { [Op.between]: [Number(req.query.study_room_from), req.query.study_room_to ? Number(req.query.study_room_to) ? Number(req.query.study_room_to) : Number(req.query.study_room_from) : Number(req.query.study_room_from)] };
  }

  // query vat
  if (req.query.vat_is_included) {
    if (req.query.vat_is_included === 'ASC') {
      apartmentOrder.push(['vat_is_included', 'ASC']);
    } else if (req.query.vat_is_included === 'DESC') {
      apartmentOrder.push(['vat_is_included', 'DESC']);
    } else {
      apartmentWhere.vat_is_included = { [Op.eq]: `${req.query.vat_is_included}` === 'Yes' };
    }
  };

  if (req.query.vat_from && Number(req.query.vat_from) >= 0) {
    apartmentWhere.vat_time = { [Op.between]: [Number(req.query.vat_from), req.query.vat_to ? Number(req.query.vat_to) ? Number(req.query.vat_to) : Number(req.query.vat_from) : Number(req.query.vat_from)] };
  }

  // query wht
  if (req.query.wht_is_included) {
    if (req.query.wht_is_included === 'ASC') {
      apartmentOrder.push(['wht_is_included', 'ASC']);
    } else if (req.query.wht_is_included === 'DESC') {
      apartmentOrder.push(['wht_is_included', 'DESC']);
    } else {
      apartmentWhere.wht_is_included = { [Op.eq]: `${req.query.wht_is_included}` === 'Yes' };
    }
  };

  if (req.query.wht_from && Number(req.query.wht_from) >= 0) {
    apartmentWhere.wht_time = { [Op.between]: [Number(req.query.wht_from), req.query.wht_to ? Number(req.query.wht_to) ? Number(req.query.wht_to) : Number(req.query.wht_from) : Number(req.query.wht_from)] };
  }

  const propertyPaymentTermWhere = {};

  if (req.query.payment_term) {
    propertyPaymentTermWhere.payment_term = { [Op.eq]: `${req.query.payment_term}` };
  }

  const picWhere = {};

  const picOrder = [];

  // query pic_fullname
  if (req.query.pic_fullname) {
    if (req.query.pic_fullname === 'ASC') {
      picOrder.push(['fullname', 'ASC']);
    } else if (req.query.pic_fullname === 'DESC') {
      picOrder.push(['fullname', 'DESC']);
    } else {
      picWhere.fullname = { [Op.like]: `%${req.query.pic_fullname}%` };
    }
  }

  // query apartment created_at
  if (req.query.created_at === 'ASC') {
    apartmentOrder.push(['created_at', 'ASC']);
  }

  if (req.query.created_at === 'DESC') {
    apartmentOrder.push(['created_at', 'DESC']);
  }

  // query apartment updated_at
  if (req.query.updated_at === 'ASC') {
    apartmentOrder.push(['updated_at', 'ASC']);
  }

  if (req.query.updated_at === 'DESC') {
    apartmentOrder.push(['updated_at', 'DESC']);
  }

  const { count, rows } = await Apartment.findAndCountAll({
    attributes: [
      'kode_propar',
      'name',
      'address',
      'size',
      'floor',
      'tower',
      'furnishing',
      'bedroom',
      'bathroom',
      'study_room',
      'available',
      'price_currency',
      'rental_price',
      'selling_price',
      'vat_percentage',
      'vat_is_included',
      'vat_details',
      'wht_percentage',
      'wht_is_included',
      'wht_details',
      'lease_term_time',
      'lease_term_type',
      'lease_term_details',
      'remarks_1',
      'remarks_2',
      'remarks_3',
      'created_at',
      'updated_at',
    ],
    where: apartmentWhere,
    order: apartmentOrder,
    include: [
      {
        model: ApartmentFacility,
        as: "facilities",
        separate: true,
        attributes: [
          'id',
        ],
        include: {
          model: PropertyFacilityName,
          as: "property_facility_name",
          attributes: ['id', 'facility_name'],
          where: propertyFacilityNameWhere,
          order: propertyFacilityOrder,
        },
      },
      {
        model: ApartmentPhoto,
        as: "photos",
        separate: true,
        attributes: ['id', 'photo_path', 'photo_url'],
        where: apartmentPhotoWhere,
        order: [['id', 'ASC']],
      },
      {
        model: PropertyArea,
        as: "property_area",
        attributes: ['id', 'region_name'],
        where: propertyAreaWhere,
        order: propertyAreaOrder,
      },
      {
        model: PropertyPaymentTerm,
        as: "property_payment_term",
        attributes: ['id', 'payment_term'],
        where: propertyPaymentTermWhere,
        required: false,
      },
      {
        model: PropertyPersonInCharge,
        as: "property_person_in_charge",
        attributes: [
          'id',
          'fullname',
          'phone_number'
        ],
        where: picWhere,
        group: 'fullname',
        order: picOrder,
        required: false,
        include: [
          {
            model: PropertyPersonInChargeRole,
            as: "property_person_in_charge_role",
            attributes: ['id', 'name'],
          },
          {
            model: PropertyPersonInChargeCompany,
            as: "property_person_in_charge_company",
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Apartment Data` });

  return {
    records: rows,
  };
}

module.exports = getAllApartments;
