const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { deleteExistingUserByUsername } = require("../../services/users");

router.delete("/:username", async (req, res, next) => {
  try {
    await deleteExistingUserByUsername(req);

    const response = new SuccessResponse(204, "NO_CONTENT", new DataDetails("users", null));
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
