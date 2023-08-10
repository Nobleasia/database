const { Op } = require('sequelize');

const Log = require("../../models/log");
const { Land, LandPhoto } = require("../../models/land");
const { PropertyArea, PropertyPersonInCharge, PropertyPaymentTerm, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const getAllLands = async (req) => {
  const landWhere = {};

  const landOrder = [];

  // query kode_propar
  if (req.query.kode_propar) {
    if (req.query.kode_propar === 'ASC') {
      landOrder.push(['kode_propar', 'ASC']);
    } else if (req.query.kode_propar === 'DESC') {
      landOrder.push(['kode_propar', 'DESC']);
    } else {
      landWhere.kode_propar = { [Op.like]: `%${req.query.kode_propar}%` };
    }
  }

  // query address
  if (req.query.address) {
    if (req.query.address === 'ASC') {
      landOrder.push(['address', 'ASC']);
    } else if (req.query.address === 'DESC') {
      landOrder.push(['address', 'DESC']);
    } else {
      landWhere.address = { [Op.like]: `%${req.query.address}%` };
    }
  }

  // query land size
  if (req.query.land_size === 'ASC') {
    landOrder.push(['semi_gross_area', 'ASC']);
  }

  if (req.query.land_size === 'DESC') {
    landOrder.push(['semi_gross_area', 'DESC']);
  }

  if (req.query.land_size_from && Number(req.query.land_size_from)) {
    landWhere.land_size = { [Op.between]: [Number(req.query.land_size_from), req.query.land_size_to ? Number(req.query.land_size_to) ? Number(req.query.land_size_to) : Number(req.query.land_size_from) : Number(req.query.land_size_from)] };
  }

  // query ownership
  if (req.query.ownership) {
    if (req.query.ownership === 'ASC') {
      landOrder.push(['ownership', 'ASC']);
    } else if (req.query.ownership === 'DESC') {
      landOrder.push(['ownership', 'DESC']);
    } else {
      landWhere.ownership = { [Op.like]: `%${req.query.ownership}%` };
    }
  }

  // query zone
  if (req.query.zone) {
    if (req.query.zone === 'ASC') {
      landOrder.push(['zone', 'ASC']);
    } else if (req.query.zone === 'DESC') {
      landOrder.push(['zone', 'DESC']);
    } else {
      landWhere.zone = { [Op.like]: `%${req.query.zone}%` };
    }
  }

  // query available
  if (req.query.available) {
    if (req.query.available === 'ASC') {
      landOrder.push(['available', 'ASC']);
    } else if (req.query.available === 'DESC') {
      landOrder.push(['available', 'DESC']);
    } else {
      landWhere.available = { [Op.eq]: `${req.query.available}` === 'Yes' };
    }
  };

  const landPhotoWhere = {};

  // query id foto
  if (req.query.photo_ids) {
    landPhotoWhere.id = {
      [Op.or]: req.query.photo_ids.split(",").map(id => {
        if (parseInt(id)) {
          return parseInt(id)
        }

        const err = new ErrorDetails("LandError", "photo_ids", "photo_ids must be integer");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }),
    };

    console.log(landPhotoWhere)
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

  // query price
  if (req.query.price === 'ASC') {
    landOrder.push(['price', 'ASC']);
  }

  if (req.query.price === 'DESC') {
    landOrder.push(['price', 'DESC']);
  }

  if (req.query.price_from && Number(req.query.price_from) >= 0) {
    landWhere.price = { [Op.between]: [Number(req.query.price_from), req.query.price_to ? Number(req.query.price_to) ? Number(req.query.price_to) : Number(req.query.price_from) : Number(req.query.price_from)] };
  }

  // query price currency
  if (req.query.price_currency) {
    if (req.query.price_currency === 'ASC') {
      landOrder.push(['price_currency', 'ASC']);
    } else if (req.query.price_currency === 'DESC') {
      landOrder.push(['price_currency', 'DESC']);
    } else {
      landWhere.price_currency = { [Op.eq]: `${req.query.price_currency}` };
    }
  }

  // query lease term
  if (req.query.lease_term_time === 'ASC') {
    landOrder.push(['lease_term_time', 'ASC']);
  }

  if (req.query.lease_term_time === 'DESC') {
    landOrder.push(['lease_term_time', 'DESC']);
  }

  if (req.query.lease_term_time_from && Number(req.query.lease_term_time_from) >= 0) {
    landWhere.lease_term_time = { [Op.between]: [Number(req.query.lease_term_time_from), req.query.lease_term_time_to ? Number(req.query.lease_term_time_to) ? Number(req.query.lease_term_time_to) : Number(req.query.lease_term_time_from) : Number(req.query.lease_term_time_from)] };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Month") {
    landWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Year") {
    landWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  // query vat
  if (req.query.vat_is_included) {
    if (req.query.vat_is_included === 'ASC') {
      landOrder.push(['vat_is_included', 'ASC']);
    } else if (req.query.vat_is_included === 'DESC') {
      landOrder.push(['vat_is_included', 'DESC']);
    } else {
      landWhere.vat_is_included = { [Op.eq]: `${req.query.vat_is_included}` === 'Yes' };
    }
  };

  if (req.query.vat_from && Number(req.query.vat_from) >= 0) {
    landWhere.vat_time = { [Op.between]: [Number(req.query.vat_from), req.query.vat_to ? Number(req.query.vat_to) ? Number(req.query.vat_to) : Number(req.query.vat_from) : Number(req.query.vat_from)] };
  }

  // query wht
  if (req.query.wht_is_included) {
    if (req.query.wht_is_included === 'ASC') {
      landOrder.push(['wht_is_included', 'ASC']);
    } else if (req.query.wht_is_included === 'DESC') {
      landOrder.push(['wht_is_included', 'DESC']);
    } else {
      landWhere.wht_is_included = { [Op.eq]: `${req.query.wht_is_included}` === 'Yes' };
    }
  };

  if (req.query.wht_from && Number(req.query.wht_from) >= 0) {
    landWhere.wht_time = { [Op.between]: [Number(req.query.wht_from), req.query.wht_to ? Number(req.query.wht_to) ? Number(req.query.wht_to) : Number(req.query.wht_from) : Number(req.query.wht_from)] };
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

  // query land created_at
  if (req.query.created_at === 'ASC') {
    landOrder.push(['created_at', 'ASC']);
  }

  if (req.query.created_at === 'DESC') {
    landOrder.push(['created_at', 'DESC']);
  }

  // query land updated_at
  if (req.query.updated_at === 'ASC') {
    landOrder.push(['updated_at', 'ASC']);
  }

  if (req.query.updated_at === 'DESC') {
    landOrder.push(['updated_at', 'DESC']);
  }

  const { count, rows } = await Land.findAndCountAll({
    attributes: [
      'kode_propar',
      'address',
      'land_size',
      'ownership',
      'available',
      'zone',
      'surroundings',
      'price_currency',
      'price',
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
    where: landWhere,
    order: landOrder,
    include: [
      {
        model: LandPhoto,
        as: "photos",
        separate: true,
        attributes: ['id', 'photo_path', 'photo_url'],
        where: landPhotoWhere,
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

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Land Data` });

  return {
    records: rows,
  };
}

module.exports = getAllLands;
