const router = require("express").Router();
const { Op } = require('sequelize');
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { getAllPropertyAreaWithCondition, getAllPropertyArea, getPropertyAreaById, } = require("../../../services/property/areas");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.region_name) {
      where.region_name = {
        [Op.substring]: req.query.region_name,
      };
    }

    if (Object.keys(where).length === 0) {
      const areas = await getAllPropertyArea();

      const response = new SuccessResponse(200, "OK", new DataDetails("property_areas", areas));
      res.status(response.code).json(response);
      return;
    }

    const areas = await getAllPropertyAreaWithCondition(where);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_areas", areas));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const area = await getPropertyAreaById(Number(req.params.id));

    const response = new SuccessResponse(200, "OK", new DataDetails("property_areas", area));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
