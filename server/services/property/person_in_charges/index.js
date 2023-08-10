const createNewPropertyPersonInCharge = require("./create_new_property_person_in_charge");
const getAllPropertyPersonInCharges = require("./get_all_property_person_in_charges");
const getAllPropertyPersonInChargeWithCondition = require("./get_all_property_person_in_charge_with_condition");
const getPropertyPersonInChargeById = require("./get_property_person_in_charge_by_id");
const updatePropertyPersonInChargeById = require("./update_property_person_in_charge_by_id");
const deletePropertyPersonInChargeById = require("./delete_property_person_in_charge_by_id");
const restorePropertyPersonInChargeById = require("./restore_property_person_in_charge_by_id");

module.exports = { createNewPropertyPersonInCharge, getAllPropertyPersonInCharges, getAllPropertyPersonInChargeWithCondition, getPropertyPersonInChargeById, updatePropertyPersonInChargeById, deletePropertyPersonInChargeById, restorePropertyPersonInChargeById };
