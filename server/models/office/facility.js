const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class OfficeFacility extends Model { }

OfficeFacility.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  office_kode_propar: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s kode propar',
      },
    },
    references: { model: 'offices', key: 'kode_propar' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  property_facility_name_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter property facility name id',
      },
    },
    references: { model: 'property_facility_names', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  detail: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.property_facility_name.facility_name}`;
    }
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'OfficeFacility',
});

module.exports = OfficeFacility;
