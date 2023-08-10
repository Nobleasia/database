const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { createNewPropertyPartialan } = require("../../services/property_partialans");

router.post("/", async (req, res, next) => {
  try {
    const id = await createNewPropertyPartialan(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("property_partialans", {
      "property_partialan_id": id,
    }));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
