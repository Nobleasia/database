const { PropertyPersonInChargeCompany } = require("../../../models/property");

const getAllPropertyPersonInChargeCompanies = async () => {
  return await PropertyPersonInChargeCompany.findAll({
    attributes: [
      'id',
      'name',
      'created_at',
      'updated_at',
    ],
  });
}

module.exports = getAllPropertyPersonInChargeCompanies;
