const router = require("express").Router();
const { Op } = require('sequelize');
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllPropertyPersonInChargeCompanyWithCondition, getAllPropertyPersonInChargeCompanies, getPropertyPersonInChargeCompanyById, } = require("../../../services/property/person_in_charge_companies");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.name) {
      where.name = {
        [Op.substring]: req.query.name,
      };
    }

    if (Object.keys(where).length === 0) {
      const personInChargeCompany = await getAllPropertyPersonInChargeCompanies();

      const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_companies", personInChargeCompany));
      res.status(response.code).json(response);
      return;
    }

    const personInChargeCompanies = await getAllPropertyPersonInChargeCompanyWithCondition(where);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_companies", personInChargeCompanies));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const personInChargeCompany = await getPropertyPersonInChargeCompanyById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_companies", personInChargeCompany));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
