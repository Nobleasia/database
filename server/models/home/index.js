const Home = require("./home");
const HomeFacility = require("./facility");
const HomePhoto = require("./photo");

const { PropertyArea, PropertyFacilityName, PropertyPaymentTerm, PropertyPersonInCharge } = require("../property");

PropertyPersonInCharge.hasMany(Home, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Home.belongsTo(PropertyPersonInCharge, { as: "property_person_in_charge" });

PropertyArea.hasMany(Home, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Home.belongsTo(PropertyArea, { as: "property_area" });

PropertyPaymentTerm.hasMany(Home, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Home.belongsTo(PropertyPaymentTerm, { as: "property_payment_term" });

Home.hasMany(HomePhoto, {
  as: "photos",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
HomePhoto.belongsTo(Home);

PropertyFacilityName.hasMany(HomeFacility, {
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
HomeFacility.belongsTo(PropertyFacilityName, { as: "property_facility_name" });

Home.hasMany(HomeFacility, {
  as: "facilities",
  onUpdate: "CASCADE",
});
HomeFacility.belongsTo(Home);

module.exports = {
  Home,
  HomeFacility,
  HomePhoto,
};
