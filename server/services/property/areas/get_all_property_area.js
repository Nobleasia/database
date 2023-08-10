const { PropertyArea } = require("../../../models/property");

const getAllPropertyArea = async () => {
  return await PropertyArea.findAll({
    attributes: [
      'id',
      'region_name',
      'created_at',
      'updated_at',
    ],
  });
}

module.exports = getAllPropertyArea;
