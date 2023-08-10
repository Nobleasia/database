const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyPaymentTerm extends Model { }

PropertyPaymentTerm.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_term: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter payment term\'s name',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyPaymentTerm',
  indexes: [
    {
      unique: true,
      fields: ["payment_term"],
    },
  ],
});

module.exports = PropertyPaymentTerm;
