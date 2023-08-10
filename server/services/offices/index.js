const createNewOffice = require("./create_new_office");
const getAllOffices = require("./get_all_offices");
const getAllOfficeKodePropar = require("./get_all_office_kode_propar");
const updateOrCreateOfficeById = require("./update_or_create_office_by_id");
const deleteOfficeById = require("./delete_office_by_id");

module.exports = { createNewOffice, getAllOffices, getAllOfficeKodePropar, updateOrCreateOfficeById, deleteOfficeById };
