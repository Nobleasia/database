const router = require('express').Router();
const { register } = require('../../services/users');

const { SuccessResponse, DataDetails } = require("../../models/response");

router.post('/', async (req, res, next) => {
  try {
    const { username, fullname, role, password } = req.body;

    await register(username, fullname, role, password, req.username);

    const response = new SuccessResponse(201, "CREATED", new DataDetails("users", null));

    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
