const User = require("./user");
const SessionBlacklist = require("./session_blacklist");

User.hasMany(SessionBlacklist);
SessionBlacklist.belongsTo(User);

module.exports = { User, SessionBlacklist };