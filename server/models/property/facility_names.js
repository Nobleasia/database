const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyFacilityName extends Model { }

PropertyFacilityName.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  facility_name: {
    type: DataTypes.STRING(100),
    unique: {
      args: true,
      msg: 'facility name is already exist in the table',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter facility name',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyFacilityName',
  indexes: [
    {
      unique: true,
      fields: ["facility_name"],
    },
  ],
});

module.exports = PropertyFacilityName;
