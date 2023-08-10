const { Apartment } = require("../../models/apartment");
const { Home } = require("../../models/home");
const { Land } = require("../../models/land");
const { Office } = require("../../models/office");

const getPropertyAnalytics = async () => {
  const { count: availableApartment } = await Apartment.findAndCountAll({
    where: {
      available: true,
    },
  });

  const { count: availableHome } = await Home.findAndCountAll({
    where: {
      available: true,
    },
  });

  const { count: availableLand } = await Land.findAndCountAll({
    where: {
      available: true,
    },
  });

  const { count: availableOffice } = await Office.findAndCountAll({
    where: {
      available: true,
    },
  });

  const { count: unavailableApartment } = await Apartment.findAndCountAll({
    where: {
      available: false,
    },
  });

  const { count: unavailableHome } = await Home.findAndCountAll({
    where: {
      available: false,
    },
  });

  const { count: unavailableLand } = await Land.findAndCountAll({
    where: {
      available: false,
    },
  });

  const { count: unavailableOffice } = await Office.findAndCountAll({
    where: {
      available: false,
    },
  });

  return {
    total_properties: availableApartment + availableHome + availableLand + availableOffice + unavailableApartment + unavailableHome + unavailableLand + unavailableOffice,
    total_available_properties: availableApartment + availableHome + availableLand + availableOffice,
    total_unavailable_properties: unavailableApartment + unavailableHome + unavailableLand + unavailableOffice,
    total_apartments: availableApartment + unavailableApartment,
    total_homes: availableHome + unavailableHome,
    total_lands: availableLand + unavailableLand,
    total_offices: availableOffice + unavailableOffice,
  };
}

module.exports = getPropertyAnalytics;
