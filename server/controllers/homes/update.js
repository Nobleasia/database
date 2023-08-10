const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { updateOrCreateHomeById } = require("../../services/homes");

const upload = generateMulter("home");

router.put("/:kode_propar", upload.array("images"), async (req, res, next) => {
  try {
    await updateOrCreateHomeById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("homes", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
