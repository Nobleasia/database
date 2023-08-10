const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyPersonInChargeCompany extends Model { }

PropertyPersonInChargeCompany.init({
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
        msg: 'Please enter PIC company name',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyPersonInChargeCompany',
  indexes: [
    {
      unique: true,
      fields: ["name"],
    },
  ],
});

module.exports = PropertyPersonInChargeCompany;
