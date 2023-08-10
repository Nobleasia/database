const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { createNewLand } = require("../../services/lands");

const upload = generateMulter("land");

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    await createNewLand(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("lands", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
