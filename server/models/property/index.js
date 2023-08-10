const PropertyArea = require("./area");
const PropertyFacilityName = require("./facility_names");
const PropertyPersonInChargeCompany = require("./person_in_charge_company");
const PropertyPersonInChargeRole = require("./person_in_charge_role");
const PropertyPersonInCharge = require("./person_in_charge");
const PropertyPaymentTerm = require("./payment_term");

PropertyPersonInChargeRole.hasMany(PropertyPersonInCharge, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
PropertyPersonInCharge.belongsTo(PropertyPersonInChargeRole, { as: "property_person_in_charge_role" });

PropertyPersonInChargeCompany.hasMany(PropertyPersonInCharge, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
PropertyPersonInCharge.belongsTo(PropertyPersonInChargeCompany, { as: "property_person_in_charge_company" });

module.exports = { PropertyArea, PropertyFacilityName, PropertyPersonInChargeCompany, PropertyPersonInChargeRole, PropertyPersonInCharge, PropertyPaymentTerm };
