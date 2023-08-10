const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class ApartmentFacility extends Model { }

ApartmentFacility.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  apartment_kode_propar: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s kode propar',
      },
    },
    references: { model: 'apartments', key: 'kode_propar' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  property_facility_name_id: {
    type: DataTypes.INTEGER,
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
  modelName: 'ApartmentFacility',
});

module.exports = ApartmentFacility;
