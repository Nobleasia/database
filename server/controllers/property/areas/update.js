const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../../models/response");
const { updateRegionNameById } = require("../../../services/property/areas");

router.put("/:id", async (req, res, next) => {
  try {
    await updateRegionNameById(Number(req.params.id), req.body.new_region_name);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("property_areas", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
