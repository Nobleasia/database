const { Op } = require('sequelize');

const Log = require("../../models/log");
const { Home, HomePhoto, HomeFacility } = require("../../models/home");
const { PropertyArea, PropertyPersonInCharge, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const getAllHomes = async (req) => {
  const homeWhere = {};

  const homeOrder = [];

  // query kode_propar
  if (req.query.kode_propar) {
    if (req.query.kode_propar === 'ASC') {
      homeOrder.push(['kode_propar', 'ASC']);
    } else if (req.query.kode_propar === 'DESC') {
      homeOrder.push(['kode_propar', 'DESC']);
    } else {
      homeWhere.kode_propar = { [Op.like]: `%${req.query.kode_propar}%` };
    }
  }

  // query name
  if (req.query.name) {
    if (req.query.name === 'ASC') {
      homeOrder.push(['name', 'ASC']);
    } else if (req.query.name === 'DESC') {
      homeOrder.push(['name', 'DESC']);
    } else {
      homeWhere.name = { [Op.like]: `%${req.query.name}%` };
    }
  }

  // query address
  if (req.query.address) {
    if (req.query.address === 'ASC') {
      homeOrder.push(['address', 'ASC']);
    } else if (req.query.address === 'DESC') {
      homeOrder.push(['address', 'DESC']);
    } else {
      homeWhere.address = { [Op.like]: `%${req.query.address}%` };
    }
  }

  // query land size
  if (req.query.land_size === 'ASC') {
    homeOrder.push(['land_size', 'ASC']);
  }

  if (req.query.land_size === 'DESC') {
    homeOrder.push(['land_size', 'DESC']);
  }

  if (req.query.land_size_from && Number(req.query.land_size_from)) {
    homeWhere.land_size = { [Op.between]: [Number(req.query.land_size_from), req.query.land_size_to ? Number(req.query.land_size_to) ? Number(req.query.land_size_to) : Number(req.query.land_size_from) : Number(req.query.land_size_from)] };
  }

  // query building size
  if (req.query.building_size === 'ASC') {
    homeOrder.push(['building_size', 'ASC']);
  }

  if (req.query.building_size === 'DESC') {
    homeOrder.push(['building_size', 'DESC']);
  }

  if (req.query.building_size_from && Number(req.query.building_size_from)) {
    homeWhere.building_size = { [Op.between]: [Number(req.query.building_size_from), req.query.building_size_to ? Number(req.query.building_size_to) ? Number(req.query.building_size_to) : Number(req.query.building_size_from) : Number(req.query.building_size_from)] };
  }

  // query stories
  if (req.query.stories === 'ASC') {
    homeOrder.push(['stories', 'ASC']);
  }

  if (req.query.stories === 'DESC') {
    homeOrder.push(['stories', 'DESC']);
  }

  if (req.query.stories_from && Number(req.query.stories_from)) {
    homeWhere.stories = { [Op.between]: [Number(req.query.stories_from), req.query.stories_to ? Number(req.query.stories_to) ? Number(req.query.stories_to) : Number(req.query.stories_from) : Number(req.query.stories_from)] };
  }

  // query furnishing
  if (req.query.furnishing) {
    if (req.query.furnishing === 'ASC') {
      homeOrder.push(['furnishing', 'ASC']);
    } else if (req.query.furnishing === 'DESC') {
      homeOrder.push(['furnishing', 'DESC']);
    } else {
      homeWhere.furnishing = `${req.query.furnishing}`;
    }
  }

  // query house_type
  if (req.query.house_type) {
    if (req.query.house_type === 'ASC') {
      homeOrder.push(['house_type', 'ASC']);
    } else if (req.query.house_type === 'DESC') {
      homeOrder.push(['house_type', 'DESC']);
    } else {
      homeWhere.house_type = `${req.query.house_type}`;
    }
  }

  // query available
  if (req.query.available) {
    if (req.query.available === 'ASC') {
      homeOrder.push(['available', 'ASC']);
    } else if (req.query.available === 'DESC') {
      homeOrder.push(['available', 'DESC']);
    } else {
      homeWhere.available = { [Op.eq]: `${req.query.available}` === 'Yes' };
    }
  };

  // query backyard
  if (req.query.backyard) {
    if (req.query.backyard === 'ASC') {
      homeOrder.push(['backyard', 'ASC']);
    } else if (req.query.backyard === 'DESC') {
      homeOrder.push(['backyard', 'DESC']);
    } else {
      homeWhere.backyard = { [Op.eq]: `${req.query.backyard}` === 'Yes' };
    }
  };

  // query swimming_pool
  if (req.query.swimming_pool) {
    if (req.query.swimming_pool === 'ASC') {
      homeOrder.push(['swimming_pool', 'ASC']);
    } else if (req.query.swimming_pool === 'DESC') {
      homeOrder.push(['swimming_pool', 'DESC']);
    } else {
      homeWhere.swimming_pool = { [Op.eq]: `${req.query.swimming_pool}` === 'Yes' };
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

  const homePhotoWhere = {};

  // query id foto
  if (req.query.photo_ids) {
    homePhotoWhere.id = {
      [Op.or]: req.query.photo_ids.split(",").map(id => {
        if (parseInt(id)) {
          return parseInt(id)
        }

        const err = new ErrorDetails("HomeError", "photo_ids", "photo_ids must be integer");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }),
    };

    console.log(homePhotoWhere)
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
    homeOrder.push(['rental_price', 'ASC']);
  }

  if (req.query.rental_price === 'DESC') {
    homeOrder.push(['rental_price', 'DESC']);
  }

  if (req.query.rental_price_from && Number(req.query.rental_price_from) >= 0) {
    homeWhere.rental_price = { [Op.between]: [Number(req.query.rental_price_from), req.query.rental_price_to ? Number(req.query.rental_price_to) ? Number(req.query.rental_price_to) : Number(req.query.rental_price_from) : Number(req.query.rental_price_from)] };
  }

  // query selling price
  if (req.query.selling_price === 'ASC') {
    homeOrder.push(['selling_price', 'ASC']);
  }

  if (req.query.selling_price === 'DESC') {
    homeOrder.push(['selling_price', 'DESC']);
  }

  if (req.query.selling_price_from && Number(req.query.selling_price_from) >= 0) {
    homeWhere.selling_price = { [Op.between]: [Number(req.query.selling_price_from), req.query.selling_price_to ? Number(req.query.selling_price_to) ? Number(req.query.selling_price_to) : Number(req.query.selling_price_from) : Number(req.query.selling_price_from)] };
  }

  // query compound fee
  if (req.query.compound_fee === 'ASC') {
    homeOrder.push(['compound_fee', 'ASC']);
  }

  if (req.query.compound_fee === 'DESC') {
    homeOrder.push(['compound_fee', 'DESC']);
  }

  if (req.query.compound_fee_from && Number(req.query.compound_fee_from) >= 0) {
    homeWhere.compound_fee = { [Op.between]: [Number(req.query.compound_fee_from), req.query.compound_fee_to ? Number(req.query.compound_fee_to) ? Number(req.query.compound_fee_to) : Number(req.query.compound_fee_from) : Number(req.query.compound_fee_from)] };
  }

  // query price currency
  if (req.query.price_currency) {
    if (req.query.price_currency === 'ASC') {
      homeOrder.push(['price_currency', 'ASC']);
    } else if (req.query.price_currency === 'DESC') {
      homeOrder.push(['price_currency', 'DESC']);
    } else {
      homeWhere.price_currency = { [Op.eq]: `${req.query.price_currency}` };
    }
  }

  // query lease term
  if (req.query.lease_term_time === 'ASC') {
    homeOrder.push(['lease_term_time', 'ASC']);
  }

  if (req.query.lease_term_time === 'DESC') {
    homeOrder.push(['lease_term_time', 'DESC']);
  }

  if (req.query.lease_term_time_from && Number(req.query.lease_term_time_from) >= 0) {
    homeWhere.lease_term_time = { [Op.between]: [Number(req.query.lease_term_time_from), req.query.lease_term_time_to ? Number(req.query.lease_term_time_to) ? Number(req.query.lease_term_time_to) : Number(req.query.lease_term_time_from) : Number(req.query.lease_term_time_from)] };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Month") {
    homeWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Year") {
    homeWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  // query bedroom
  if (req.query.bedroom_from && Number(req.query.bedroom_from) >= 0) {
    homeWhere.bedroom_time = { [Op.between]: [Number(req.query.bedroom_from), req.query.bedroom_to ? Number(req.query.bedroom_to) ? Number(req.query.bedroom_to) : Number(req.query.bedroom_from) : Number(req.query.bedroom_from)] };
  }

  // query bathroom
  if (req.query.bathroom_from && Number(req.query.bathroom_from) >= 0) {
    homeWhere.bathroom_time = { [Op.between]: [Number(req.query.bathroom_from), req.query.bathroom_to ? Number(req.query.bathroom_to) ? Number(req.query.bathroom_to) : Number(req.query.bathroom_from) : Number(req.query.bathroom_from)] };
  }

  // query study room
  if (req.query.study_room_from && Number(req.query.study_room_from) >= 0) {
    homeWhere.study_room_time = { [Op.between]: [Number(req.query.study_room_from), req.query.study_room_to ? Number(req.query.study_room_to) ? Number(req.query.study_room_to) : Number(req.query.study_room_from) : Number(req.query.study_room_from)] };
  }

  // query carport_or_garage
  if (req.query.carport_or_garage_from && Number(req.query.carport_or_garage_from) >= 0) {
    homeWhere.carport_or_garage_time = { [Op.between]: [Number(req.query.carport_or_garage_from), req.query.carport_or_garage_to ? Number(req.query.carport_or_garage_to) ? Number(req.query.carport_or_garage_to) : Number(req.query.carport_or_garage_from) : Number(req.query.carport_or_garage_from)] };
  }

  // query vat
  if (req.query.vat_is_included) {
    if (req.query.vat_is_included === 'ASC') {
      homeOrder.push(['vat_is_included', 'ASC']);
    } else if (req.query.vat_is_included === 'DESC') {
      homeOrder.push(['vat_is_included', 'DESC']);
    } else {
      homeWhere.vat_is_included = { [Op.eq]: `${req.query.vat_is_included}` === 'Yes' };
    }
  };

  if (req.query.vat_from && Number(req.query.vat_from) >= 0) {
    homeWhere.vat_time = { [Op.between]: [Number(req.query.vat_from), req.query.vat_to ? Number(req.query.vat_to) ? Number(req.query.vat_to) : Number(req.query.vat_from) : Number(req.query.vat_from)] };
  }

  // query wht
  if (req.query.wht_is_included) {
    if (req.query.wht_is_included === 'ASC') {
      homeOrder.push(['wht_is_included', 'ASC']);
    } else if (req.query.wht_is_included === 'DESC') {
      homeOrder.push(['wht_is_included', 'DESC']);
    } else {
      homeWhere.wht_is_included = { [Op.eq]: `${req.query.wht_is_included}` === 'Yes' };
    }
  };

  if (req.query.wht_from && Number(req.query.wht_from) >= 0) {
    homeWhere.wht_time = { [Op.between]: [Number(req.query.wht_from), req.query.wht_to ? Number(req.query.wht_to) ? Number(req.query.wht_to) : Number(req.query.wht_from) : Number(req.query.wht_from)] };
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

  // query home created_at
  if (req.query.created_at === 'ASC') {
    homeOrder.push(['created_at', 'ASC']);
  }

  if (req.query.created_at === 'DESC') {
    homeOrder.push(['created_at', 'DESC']);
  }

  // query home updated_at
  if (req.query.updated_at === 'ASC') {
    homeOrder.push(['updated_at', 'ASC']);
  }

  if (req.query.updated_at === 'DESC') {
    homeOrder.push(['updated_at', 'DESC']);
  }

  const { count, rows } = await Home.findAndCountAll({
    attributes: [
      'kode_propar',
      'name',
      'address',
      'land_size',
      'building_size',
      'stories',
      'furnishing',
      'bedroom',
      'bathroom',
      'study_room',
      'carport_or_garage',
      'backyard',
      'swimming_pool',
      'house_type',
      'available',
      'price_currency',
      'rental_price',
      'selling_price',
      'compound_fee',
      'compound_fee_coverage',
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
    where: homeWhere,
    order: homeOrder,
    include: [
      {
        model: HomeFacility,
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
        model: HomePhoto,
        as: "photos",
        separate: true,
        attributes: ['id', 'photo_path', 'photo_url'],
        where: homePhotoWhere,
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

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Home Data` });

  return {
    records: rows,
  };
}

module.exports = getAllHomes;
