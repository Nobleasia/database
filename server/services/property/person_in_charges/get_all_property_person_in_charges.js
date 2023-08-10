const { PropertyPersonInCharge, PropertyPersonInChargeRole, PropertyPersonInChargeCompany } = require("../../../models/property");

const getAllPropertyPersonInCharges = async () => {
  return await PropertyPersonInCharge.findAll({
    attributes: [
      "id",
      "fullname",
      "phone_number",
      'created_at',
      'updated_at',
    ],
    include: [
      {
        model: PropertyPersonInChargeCompany,
        as: "property_person_in_charge_company",
        attributes: ["id", "name"],
      },
      {
        model: PropertyPersonInChargeRole,
        as: "property_person_in_charge_role",
        attributes: ["id", "name"],
      },
    ],
  });
}

module.exports = getAllPropertyPersonInCharges;
