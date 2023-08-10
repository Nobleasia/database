const createNewPropertyPaymentTerm = require("./create_new_property_payment_terms");
const getAllPropertyPaymentTerm = require("./get_all_property_payment_term");
const getAllPropertyPaymentTermWithCondition = require("./get_all_property_payment_term_with_condition");
const getPropertyPaymentTermById = require("./get_property_payment_term_by_id");
const updatePaymentTermById = require("./update_payment_term_by_id");
const deletePropertyPaymentTermById = require("./delete_property_payment_term_by_id");

module.exports = { createNewPropertyPaymentTerm, getAllPropertyPaymentTerm, getAllPropertyPaymentTermWithCondition, getPropertyPaymentTermById, updatePaymentTermById, deletePropertyPaymentTermById };
