const { Op } = require('sequelize');

const Log = require("../../models/log");
const { User } = require("../../models/user");
const { ErrorResponse, ErrorDetails } = require("../../models/response");

const getAllUsers = async (req) => {
  const userWhere = {};

  const userOrder = [];

  // query username
  if (req.query.username) {
    if (req.query.username === 'ASC') {
      userOrder.push(['username', 'ASC']);
    } else if (req.query.username === 'DESC') {
      userOrder.push(['username', 'DESC']);
    } else {
      userWhere.username = { [Op.like]: `%${req.query.username}%` };
    }
  }

  // query fullname
  if (req.query.fullname) {
    if (req.query.fullname === 'ASC') {
      userOrder.push(['fullname', 'ASC']);
    } else if (req.query.fullname === 'DESC') {
      userOrder.push(['fullname', 'DESC']);
    } else {
      userWhere.fullname = { [Op.like]: `%${req.query.fullname}%` };
    }
  }

  // query role
  if (req.query.role === "superadmin" || req.query.role === "admin" || req.query.role === "user") {
    userWhere.role = { [Op.eq]: `${req.query.role}` };
  }

  // query user updated_at
  if (req.query.updated_at === 'ASC') {
    userOrder.push(['updated_at', 'ASC']);
  }

  if (req.query.updated_at === 'DESC') {
    userOrder.push(['updated_at', 'DESC']);
  }

  const { count, rows } = await User.findAndCountAll({
    attributes: [
      'username',
      'fullname',
      'role',
      'updated_at',
    ],
    where: userWhere,
    order: userOrder,
    offset: Number(req.query.page) && Number(req.query.size) ? (Number(req.query.page) - 1) * Number(req.query.size) : 0,
    limit: Number(req.query.page) && Number(req.query.size) ? Number(req.query.size) === 5 ? 5 : Number(req.query.size) === 25 ? 25 : Number(req.query.size) === 50 ? 50 : 25 : 25,
  });

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Users Data` });

  return {
    records: rows,
  };
}

module.exports = getAllUsers;
