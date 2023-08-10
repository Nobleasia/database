const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { updateOrCreateLandById } = require("../../services/lands");

const upload = generateMulter("land");

router.put("/:kode_propar", upload.array("images"), async (req, res, next) => {
  try {
    await updateOrCreateLandById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("lands", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
