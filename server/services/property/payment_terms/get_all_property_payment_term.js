const { PropertyPaymentTerm } = require("../../../models/property");

const getAllPropertyPaymentTerm = async () => {
  return await PropertyPaymentTerm.findAll({
    attributes: [
      'id',
      'payment_term',
      'created_at',
      'updated_at',
    ],
  });
}

module.exports = getAllPropertyPaymentTerm;
