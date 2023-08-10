const { PropertyPersonInChargeRole } = require("../../../models/property");

const getAllPropertyPersonInChargeRoles = async () => {
  return await PropertyPersonInChargeRole.findAll({
    attributes: [
      'id',
      'name',
      'created_at',
      'updated_at',
    ],
  });
}

module.exports = getAllPropertyPersonInChargeRoles;
