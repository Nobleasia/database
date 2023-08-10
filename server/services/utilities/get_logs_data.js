const Log = require("../../models/log");

const getLogsData = async (req) => {
  if (req.query.page && isNaN(Number(req.query.page))) {
    const err = new ErrorDetails("UserError", "pagination", "page must be integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  if (req.query.size && isNaN(Number(req.query.size))) {
    const err = new ErrorDetails("UserError", "pagination", "size must be integer");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(400, "BAD_REQUEST", { [err.attribute]: err.message });
  }

  const { count, rows } = await Log.findAndCountAll({
    attributes: [
      'created_at',
      'status_code',
      'message',
      'username',
    ],
    order: [['created_at', 'DESC']],
    offset: Number(req.query.page) && Number(req.query.size) ? (Number(req.query.page) - 1) * Number(req.query.size) : 0,
    limit: Number(req.query.page) && Number(req.query.size) ? Number(req.query.size) === 5 ? 5 : Number(req.query.size) === 25 ? 25 : Number(req.query.size) === 50 ? 50 : 25 : 25,
  });

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Logs Data` });

  return {
    current_page: Number(req.query.page) ? Number(req.query.page) : 1,
    data_count_on_current_page: rows.length,
    total_data_count: count,
    total_pages: Math.ceil(count / (Number(req.query.page) && Number(req.query.size) ? Number(req.query.size) === 5 ? 5 : Number(req.query.size) === 25 ? 25 : Number(req.query.size) === 50 ? 50 : 25 : 25)),
    records: rows,
  };
}

module.exports = getLogsData;
