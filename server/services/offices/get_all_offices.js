const { Op } = require('sequelize');

const Log = require("../../models/log");
const { Office, OfficePhoto, OfficeFacility } = require("../../models/office");
const { PropertyArea, PropertyPersonInCharge, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../models/property");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const getAllOffices = async (req) => {
  const officeWhere = {};

  const officeOrder = [];

  // query kode_propar
  if (req.query.kode_propar) {
    if (req.query.kode_propar === 'ASC') {
      officeOrder.push(['kode_propar', 'ASC']);
    } else if (req.query.kode_propar === 'DESC') {
      officeOrder.push(['kode_propar', 'DESC']);
    } else {
      officeWhere.kode_propar = { [Op.like]: `%${req.query.kode_propar}%` };
    }
  }

  // query name
  if (req.query.name) {
    if (req.query.name === 'ASC') {
      officeOrder.push(['name', 'ASC']);
    } else if (req.query.name === 'DESC') {
      officeOrder.push(['name', 'DESC']);
    } else {
      officeWhere.name = { [Op.like]: `%${req.query.name}%` };
    }
  }

  // query address
  if (req.query.address) {
    if (req.query.address === 'ASC') {
      officeOrder.push(['address', 'ASC']);
    } else if (req.query.address === 'DESC') {
      officeOrder.push(['address', 'DESC']);
    } else {
      officeWhere.address = { [Op.like]: `%${req.query.address}%` };
    }
  }

  // query size
  if (req.query.office_semi_gross_area === 'ASC') {
    officeOrder.push(['semi_gross_area', 'ASC']);
  }

  if (req.query.office_semi_gross_area === 'DESC') {
    officeOrder.push(['semi_gross_area', 'DESC']);
  }

  if (req.query.semi_gross_area_from && Number(req.query.semi_gross_area_from)) {
    officeWhere.semi_gross_area = { [Op.between]: [Number(req.query.semi_gross_area_from), req.query.semi_gross_area_to ? Number(req.query.semi_gross_area_to) ? Number(req.query.semi_gross_area_to) : Number(req.query.semi_gross_area_from) : Number(req.query.semi_gross_area_from)] };
  }

  // query floor
  if (req.query.grade) {
    if (req.query.grade === 'ASC') {
      officeOrder.push(['grade', 'ASC']);
    } else if (req.query.grade === 'DESC') {
      officeOrder.push(['grade', 'DESC']);
    } else {
      officeWhere.grade = { [Op.like]: `%${req.query.grade}%` };
    }
  }

  // query floor
  if (req.query.floor) {
    if (req.query.floor === 'ASC') {
      officeOrder.push(['floor', 'ASC']);
    } else if (req.query.floor === 'DESC') {
      officeOrder.push(['floor', 'DESC']);
    } else {
      officeWhere.floor = { [Op.like]: `%${req.query.floor}%` };
    }
  }

  // query condition
  if (req.query.condition) {
    if (req.query.condition === 'ASC') {
      officeOrder.push(['condition', 'ASC']);
    } else if (req.query.condition === 'DESC') {
      officeOrder.push(['condition', 'DESC']);
    } else {
      officeWhere.condition = `${req.query.condition}`;
    }
  }

  // query available
  if (req.query.available) {
    if (req.query.available === 'ASC') {
      officeOrder.push(['available', 'ASC']);
    } else if (req.query.available === 'DESC') {
      officeOrder.push(['available', 'DESC']);
    } else {
      officeWhere.available = { [Op.eq]: `${req.query.available}` === 'Yes' };
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

  const officePhotoWhere = {};

  // query id foto
  if (req.query.photo_ids) {
    officePhotoWhere.id = {
      [Op.or]: req.query.photo_ids.split(",").map(id => {
        if (parseInt(id)) {
          return parseInt(id)
        }

        const err = new ErrorDetails("OfficeError", "photo_ids", "photo_ids must be integer");
        // TODO: ganti console ke log kalau sudah mau production
        console.error(err);
        throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
      }),
    };

    console.log(officePhotoWhere)
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

  // query building completion
  if (req.query.building_completion === 'ASC') {
    officeOrder.push(['building_completion', 'ASC']);
  }

  if (req.query.building_completion === 'DESC') {
    officeOrder.push(['building_completion', 'DESC']);
  }

  if (req.query.building_completion_from && Number(req.query.building_completion_from) >= 0) {
    officeWhere.building_completion = { [Op.between]: [Number(req.query.building_completion_from), req.query.building_completion_to ? Number(req.query.building_completion_to) ? Number(req.query.building_completion_to) : Number(req.query.building_completion_from) : Number(req.query.building_completion_from)] };
  }

  // query rental price
  if (req.query.rental_price === 'ASC') {
    officeOrder.push(['rental_price', 'ASC']);
  }

  if (req.query.rental_price === 'DESC') {
    officeOrder.push(['rental_price', 'DESC']);
  }

  if (req.query.rental_price_from && Number(req.query.rental_price_from) >= 0) {
    officeWhere.rental_price = { [Op.between]: [Number(req.query.rental_price_from), req.query.rental_price_to ? Number(req.query.rental_price_to) ? Number(req.query.rental_price_to) : Number(req.query.rental_price_from) : Number(req.query.rental_price_from)] };
  }

  // query selling price
  if (req.query.selling_price === 'ASC') {
    officeOrder.push(['selling_price', 'ASC']);
  }

  if (req.query.selling_price === 'DESC') {
    officeOrder.push(['selling_price', 'DESC']);
  }

  if (req.query.selling_price_from && Number(req.query.selling_price_from) >= 0) {
    officeWhere.selling_price = { [Op.between]: [Number(req.query.selling_price_from), req.query.selling_price_to ? Number(req.query.selling_price_to) ? Number(req.query.selling_price_to) : Number(req.query.selling_price_from) : Number(req.query.selling_price_from)] };
  }

  // query price currency
  if (req.query.price_currency) {
    if (req.query.price_currency === 'ASC') {
      officeOrder.push(['price_currency', 'ASC']);
    } else if (req.query.price_currency === 'DESC') {
      officeOrder.push(['price_currency', 'DESC']);
    } else {
      officeWhere.price_currency = { [Op.eq]: `${req.query.price_currency}` };
    }
  }

  // query lease term
  if (req.query.lease_term_time === 'ASC') {
    officeOrder.push(['lease_term_time', 'ASC']);
  }

  if (req.query.lease_term_time === 'DESC') {
    officeOrder.push(['lease_term_time', 'DESC']);
  }

  if (req.query.lease_term_time_from && Number(req.query.lease_term_time_from) >= 0) {
    officeWhere.lease_term_time = { [Op.between]: [Number(req.query.lease_term_time_from), req.query.lease_term_time_to ? Number(req.query.lease_term_time_to) ? Number(req.query.lease_term_time_to) : Number(req.query.lease_term_time_from) : Number(req.query.lease_term_time_from)] };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Month") {
    officeWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  if (req.query.lease_term_type && req.query.lease_term_type === "Year") {
    officeWhere.lease_term_type = { [Op.eq]: `${req.query.lease_term_type}` };
  }

  // query service charge
  if (req.query.service_charge_price === 'ASC') {
    officeOrder.push(['service_charge_price', 'ASC']);
  }

  if (req.query.service_charge_price === 'DESC') {
    officeOrder.push(['service_charge_price', 'DESC']);
  }

  if (req.query.service_charge_price_from && Number(req.query.service_charge_price_from) >= 0) {
    officeWhere.service_charge_price = { [Op.between]: [Number(req.query.service_charge_price_from), req.query.service_charge_price_to ? Number(req.query.service_charge_price_to) ? Number(req.query.service_charge_price_to) : Number(req.query.service_charge_price_from) : Number(req.query.service_charge_price_from)] };
  }

  if (req.query.service_charge_time && req.query.service_charge_time === "Month") {
    officeWhere.service_charge_time = { [Op.eq]: `${req.query.service_charge_time}` };
  }

  if (req.query.service_charge_time && req.query.service_charge_time === "Year") {
    officeWhere.service_charge_time = { [Op.eq]: `${req.query.service_charge_time}` };
  }

  // query overtime
  if (req.query.overtime_price === 'ASC') {
    officeOrder.push(['overtime_price', 'ASC']);
  }

  if (req.query.overtime_price === 'DESC') {
    officeOrder.push(['overtime_price', 'DESC']);
  }

  if (req.query.overtime_price_from && Number(req.query.overtime_price_from) >= 0) {
    officeWhere.overtime_price = { [Op.between]: [Number(req.query.overtime_price_from), req.query.overtime_price_to ? Number(req.query.overtime_price_to) ? Number(req.query.overtime_price_to) : Number(req.query.overtime_price_from) : Number(req.query.overtime_price_from)] };
  }

  if (req.query.overtime_time && req.query.overtime_time === "Hour") {
    officeWhere.overtime_time = { [Op.eq]: `${req.query.overtime_time}` };
  }

  if (req.query.overtime_time && req.query.overtime_time === "Day") {
    officeWhere.overtime_time = { [Op.eq]: `${req.query.overtime_time}` };
  }

  // query vat
  if (req.query.vat_is_included) {
    if (req.query.vat_is_included === 'ASC') {
      officeOrder.push(['vat_is_included', 'ASC']);
    } else if (req.query.vat_is_included === 'DESC') {
      officeOrder.push(['vat_is_included', 'DESC']);
    } else {
      officeWhere.vat_is_included = { [Op.eq]: `${req.query.vat_is_included}` === 'Yes' };
    }
  };

  if (req.query.vat_from && Number(req.query.vat_from) >= 0) {
    officeWhere.vat_time = { [Op.between]: [Number(req.query.vat_from), req.query.vat_to ? Number(req.query.vat_to) ? Number(req.query.vat_to) : Number(req.query.vat_from) : Number(req.query.vat_from)] };
  }

  // query wht
  if (req.query.wht_is_included) {
    if (req.query.wht_is_included === 'ASC') {
      officeOrder.push(['wht_is_included', 'ASC']);
    } else if (req.query.wht_is_included === 'DESC') {
      officeOrder.push(['wht_is_included', 'DESC']);
    } else {
      officeWhere.wht_is_included = { [Op.eq]: `${req.query.wht_is_included}` === 'Yes' };
    }
  };

  if (req.query.wht_from && Number(req.query.wht_from) >= 0) {
    officeWhere.wht_time = { [Op.between]: [Number(req.query.wht_from), req.query.wht_to ? Number(req.query.wht_to) ? Number(req.query.wht_to) : Number(req.query.wht_from) : Number(req.query.wht_from)] };
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

  // query office created_at
  if (req.query.created_at === 'ASC') {
    officeOrder.push(['created_at', 'ASC']);
  }

  if (req.query.created_at === 'DESC') {
    officeOrder.push(['created_at', 'DESC']);
  }

  // query office updated_at
  if (req.query.updated_at === 'ASC') {
    officeOrder.push(['updated_at', 'ASC']);
  }

  if (req.query.updated_at === 'DESC') {
    officeOrder.push(['updated_at', 'DESC']);
  }

  const { count, rows } = await Office.findAndCountAll({
    attributes: [
      'kode_propar',
      'name',
      'address',
      'semi_gross_area',
      'building_completion',
      'certificates',
      'grade',
      'floor',
      'condition',
      'available',
      'price_currency',
      'rental_price',
      'selling_price',
      'service_charge_price',
      'service_charge_time',
      'service_charge_details',
      'overtime_price',
      'overtime_time',
      'overtime_details',
      'vat_percentage',
      'vat_is_included',
      'vat_details',
      'wht_percentage',
      'wht_is_included',
      'wht_details',
      'lease_term_time',
      'lease_term_type',
      'lease_term_details',
      'security_deposit',
      'parking_ratio',
      'remarks_1',
      'remarks_2',
      'remarks_3',
      'created_at',
      'updated_at',
    ],
    where: officeWhere,
    order: officeOrder,
    include: [
      {
        model: OfficeFacility,
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
        model: OfficePhoto,
        as: "photos",
        separate: true,
        attributes: ['id', 'photo_path', 'photo_url'],
        where: officePhotoWhere,
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

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Office Data` });

  return {
    records: rows,
  };
}

module.exports = getAllOffices;
