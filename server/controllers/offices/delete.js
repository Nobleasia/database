const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { deleteOfficeById } = require("../../services/offices");

router.delete("/:kode_propar", async (req, res, next) => {
  try {
    await deleteOfficeById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("offices", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
