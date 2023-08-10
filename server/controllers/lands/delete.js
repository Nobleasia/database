const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { deleteLandById } = require("../../services/lands");

router.delete("/:kode_propar", async (req, res, next) => {
  try {
    await deleteLandById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("lands", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
