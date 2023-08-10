const Land = require("./land");
const LandPhoto = require("./photo");

const { PropertyArea, PropertyPaymentTerm, PropertyPersonInCharge } = require("../property");

PropertyPersonInCharge.hasMany(Land, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Land.belongsTo(PropertyPersonInCharge, { as: "property_person_in_charge" });

PropertyArea.hasMany(Land, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Land.belongsTo(PropertyArea, { as: "property_area" });

PropertyPaymentTerm.hasMany(Land, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Land.belongsTo(PropertyPaymentTerm, { as: "property_payment_term" });

Land.hasMany(LandPhoto, {
  as: "photos",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
LandPhoto.belongsTo(Land);

module.exports = { Land, LandPhoto };
