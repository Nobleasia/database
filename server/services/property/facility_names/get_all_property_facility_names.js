const { PropertyFacilityName } = require("../../../models/property");

const getAllPropertyFacilityName = async () => {
  return await PropertyFacilityName.findAll({
    attributes: [
      'id',
      'facility_name',
      'created_at',
      'updated_at',
    ],
  });
}

module.exports = getAllPropertyFacilityName;
