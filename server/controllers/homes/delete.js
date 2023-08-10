const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { deleteHomeById } = require("../../services/homes");

router.delete("/:kode_propar", async (req, res, next) => {
  try {
    await deleteHomeById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("homes", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
