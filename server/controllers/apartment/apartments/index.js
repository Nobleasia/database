const createNewApartmentRouter = require("./create");
const readApartmentRouter = require("./read");
const readApartmentKodeProparRouter = require("./read_kode_propar");
const updateApartmentRouter = require("./update");
const deleteApartmentRouter = require("./delete");
const restoreApartmentRouter = require("./restore");

module.exports = { createNewApartmentRouter, readApartmentRouter, readApartmentKodeProparRouter, updateApartmentRouter, deleteApartmentRouter, restoreApartmentRouter };
