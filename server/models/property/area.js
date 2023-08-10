const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyArea extends Model { }

PropertyArea.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  region_name: {
    type: DataTypes.STRING(100),
    unique: {
      args: true,
      msg: 'region name is already exist in the table',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter region name',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyArea',
  indexes: [
    {
      unique: true,
      fields: ["region_name"],
    },
  ],
});

module.exports = PropertyArea;
