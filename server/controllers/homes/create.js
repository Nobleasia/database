const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { createNewHome } = require("../../services/homes");

const upload = generateMulter("home");

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    await createNewHome(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("homes", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
