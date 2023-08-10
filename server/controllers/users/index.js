const loginRouter = require("./login");
const refreshTokenRouter = require("./refresh_token");
const accessTokenValidatorRouter = require("./access_token_validator");
const registerRouter = require("./register");
const logoutRouter = require("./logout");
const readUserRouter = require("./read");
const updateUserRouter = require("./update");
const deleteUserRouter = require("./delete");

module.exports = { loginRouter, refreshTokenRouter, accessTokenValidatorRouter, registerRouter, logoutRouter, readUserRouter, updateUserRouter, deleteUserRouter };
