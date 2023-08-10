const Office = require("./office");
const OfficeFacility = require("./facility");
const OfficePhoto = require("./photo");

const { PropertyArea, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInCharge } = require("../property");

PropertyPersonInCharge.hasMany(Office, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Office.belongsTo(PropertyPersonInCharge, { as: "property_person_in_charge" });

PropertyArea.hasMany(Office, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Office.belongsTo(PropertyArea, { as: "property_area" });

PropertyPaymentTerm.hasMany(Office, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Office.belongsTo(PropertyPaymentTerm, { as: "property_payment_term" });

Office.hasMany(OfficePhoto, {
  as: "photos",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
OfficePhoto.belongsTo(Office);

PropertyFacilityName.hasMany(OfficeFacility, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
OfficeFacility.belongsTo(PropertyFacilityName, { as: "property_facility_name" });

Office.hasMany(OfficeFacility, {
  as: "facilities",
  onUpdate: "CASCADE",
});
OfficeFacility.belongsTo(Office);

module.exports = {
  Office,
  OfficeFacility,
  OfficePhoto,
};
