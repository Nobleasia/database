const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { updateExistingUserByUsername } = require("../../services/users");

router.put("/:username", async (req, res, next) => {
  try {
    await updateExistingUserByUsername(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("users", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
