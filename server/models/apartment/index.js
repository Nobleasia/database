const Apartment = require("./apartment");
const ApartmentFacility = require("./facility");
const ApartmentPhoto = require("./photo");

const { PropertyArea, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInCharge } = require("../property");

PropertyPersonInCharge.hasMany(Apartment, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Apartment.belongsTo(PropertyPersonInCharge, { as: "property_person_in_charge" });

PropertyArea.hasMany(Apartment, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Apartment.belongsTo(PropertyArea, { as: "property_area" });

PropertyPaymentTerm.hasMany(Apartment, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Apartment.belongsTo(PropertyPaymentTerm, { as: "property_payment_term" });

Apartment.hasMany(ApartmentPhoto, {
  as: "photos",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
ApartmentPhoto.belongsTo(Apartment);

PropertyFacilityName.hasMany(ApartmentFacility, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
ApartmentFacility.belongsTo(PropertyFacilityName, { as: "property_facility_name" });

Apartment.hasMany(ApartmentFacility, {
  as: "facilities",
  onUpdate: "CASCADE",
});
ApartmentFacility.belongsTo(Apartment);

module.exports = {
  Apartment,
  ApartmentFacility,
  ApartmentPhoto,
};
