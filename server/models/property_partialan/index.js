const { Model, DataTypes } = require('sequelize');

const { sequelize } = require("../../utils/db");

class PropertyPartialan extends Model { }

PropertyPartialan.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: {
      args: true,
      msg: 'Property Partialan ID has been taken',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Property Partialan ID can\'t be empty',
      },
    },
  },
  property_type: {
    type: DataTypes.ENUM('Apartment', 'Home', 'Land', 'Office'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Property Partialan property type can\'t be empty',
      },
    },
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Property Partialan content can\'t be empty',
      },
    },
  },
  expires_at: {
    type: DataTypes.DATE,
    defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expires_at to 7 days from now as default
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Property Partialan expiry time can\'t be empty',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyPartialan',
  indexes: [
    {
      unique: true,
      fields: ["id"],
    },
  ],
});

module.exports = PropertyPartialan;
