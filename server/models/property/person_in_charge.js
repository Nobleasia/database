const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class PropertyPersonInCharge extends Model { }

PropertyPersonInCharge.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter property\'s person in charge fullname',
      },
    },
  },
  property_person_in_charge_role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_person_in_charge_roles', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  property_person_in_charge_company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_person_in_charge_companies', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  phone_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'PropertyPersonInCharge',
});

module.exports = PropertyPersonInCharge;
