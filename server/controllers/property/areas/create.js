const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { createNewPropertyArea } = require("../../../services/property/areas");

router.post("/", async (req, res, next) => {
  const { region_name } = req.body;

  try {
    await createNewPropertyArea(region_name);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_areas", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
