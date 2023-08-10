const router = require("express").Router();
const { Op } = require('sequelize');
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllPropertyPersonInChargeWithCondition, getAllPropertyPersonInCharges, getPropertyPersonInChargeById, } = require("../../../services/property/person_in_charges");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.role) {
      where.role = {
        [Op.substring]: req.query.role,
      };
    }

    if (req.query.company) {
      where.company = {
        [Op.substring]: req.query.company,
      };
    }

    if (Object.keys(where).length === 0) {
      const personInCharges = await getAllPropertyPersonInCharges();

      const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charges", personInCharges));
      res.status(response.code).json(response);
      return;
    }

    const personInCharges = await getAllPropertyPersonInChargeWithCondition(where);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charges", personInCharges));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const personInCharge = await getPropertyPersonInChargeById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charges", personInCharge));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
