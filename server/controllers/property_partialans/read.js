const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getPropertyPartialanById } = require("../../services/property_partialans");

router.get("/:id", async (req, res, next) => {
  try {

    const propertyPartialan = await getPropertyPartialanById(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("property_partialans", propertyPartialan));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
