const Log = require("../../../models/log");
const { Apartment } = require("../../../models/apartment");

const getAllApartmentKodePropar = async (req) => {
  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing All Apartment Kode Propar` });

  return await Apartment.findAll({ attributes: ["kode_propar"] });
}

module.exports = getAllApartmentKodePropar;
