const Log = require("../../models/log");
const { Home } = require("../../models/home");

const getAllHomeKodePropar = async (req) => {
  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing All Home Kode Propar` });

  return await Home.findAll({ attributes: ["kode_propar"] });
}

module.exports = getAllHomeKodePropar;
