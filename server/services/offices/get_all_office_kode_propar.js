const Log = require("../../models/log");
const { Office } = require("../../models/office");

const getAllOfficeKodePropar = async (req) => {
  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing All Office Kode Propar` });

  return await Office.findAll({ attributes: ["kode_propar"] });
}

module.exports = getAllOfficeKodePropar;
