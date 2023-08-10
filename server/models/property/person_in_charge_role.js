const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyPersonInChargeRole extends Model { }

PropertyPersonInChargeRole.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter PIC role name',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyPersonInChargeRole',
  indexes: [
    {
      unique: true,
      fields: ["name"],
    },
  ],
});

module.exports = PropertyPersonInChargeRole;
