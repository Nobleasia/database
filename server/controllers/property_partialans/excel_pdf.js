const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getExcelPdfPropertyPartialan } = require("../../services/property_partialans");

router.post("/", async (req, res, next) => {
  try {
    const propertyPartialans = await getExcelPdfPropertyPartialan(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_partialans", propertyPartialans));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
