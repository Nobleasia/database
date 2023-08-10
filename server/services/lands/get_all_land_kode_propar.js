const Log = require("../../models/log");
const { Land } = require("../../models/land");

const getAllLandKodePropar = async (req) => {
  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing All Land Kode Propar` });

  return await Land.findAll({ attributes: ["kode_propar"] });
}

module.exports = getAllLandKodePropar;
