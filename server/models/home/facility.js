const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class HomeFacility extends Model { }

HomeFacility.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  home_kode_propar: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter house\'s kode propar',
      },
    },
    references: { model: 'homes', key: 'kode_propar' },
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
  modelName: 'HomeFacility',
});

module.exports = HomeFacility;
