const router = require("express").Router();
const { SuccessResponse, DataDetails } = require("../../models/response");
const { getAllUsers } = require("../../services/users");

router.get("/", async (req, res, next) => {
  try {

    const users = await getAllUsers(req);

    const response = new SuccessResponse(200, "OK", new DataDetails("users", users));
    res.status(response.code).json(response);
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
