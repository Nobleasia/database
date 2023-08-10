const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { updateOrCreateOfficeById } = require("../../services/offices");

const upload = generateMulter("office");

router.put("/:kode_propar", upload.array("images"), async (req, res, next) => {
  try {
    await updateOrCreateOfficeById(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("offices", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
