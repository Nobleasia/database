const router = require("express").Router();
const { Op } = require('sequelize');
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllPropertyPersonInChargeRoleWithCondition, getAllPropertyPersonInChargeRoles, getPropertyPersonInChargeRoleById, } = require("../../../services/property/person_in_charge_roles");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.name) {
      where.name = {
        [Op.substring]: req.query.name,
      };
    }

    if (Object.keys(where).length === 0) {
      const personInChargeRole = await getAllPropertyPersonInChargeRoles();

      const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_roles", personInChargeRole));
      res.status(response.code).json(response);
      return;
    }

    const personInChargeRoles = await getAllPropertyPersonInChargeRoleWithCondition(where);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_roles", personInChargeRoles));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const personInChargeRole = await getPropertyPersonInChargeRoleById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_person_in_charge_roles", personInChargeRole));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
