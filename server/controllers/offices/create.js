const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { generateMulter } = require("../../services/utilities");
const { createNewOffice } = require("../../services/offices");

const upload = generateMulter("office");

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    await createNewOffice(req);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("offices", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
