const { ErrorResponse, ErrorDetails } = require("../../models/response");

const Log = require("../../models/log");
const PropertyPartialan = require("../../models/property_partialan");

const getPropertyPartialanById = async (req) => {
  const { id } = req.params;

  const propertyPartialan = await PropertyPartialan.findByPk(id, { attributes: ["id", "property_type", "content"] });

  if (!propertyPartialan) {
    const err = new ErrorDetails("PropertyPartialanError", "id", "id not found");
    // TODO: ganti console ke log kalau sudah mau production
    console.error(err);
    throw new ErrorResponse(404, "NOT_FOUND", { [err.attribute]: err.message });
  }

  await Log.create({ status_code: 200, username: req.username ?? null, message: `Viewing Property Partialan - {${id}}` });

  return propertyPartialan;
}

module.exports = getPropertyPartialanById;
