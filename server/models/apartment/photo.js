const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class ApartmentPhoto extends Model { }

ApartmentPhoto.init({
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
  photo_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s photo filepath',
      },
    },
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s photo url',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'ApartmentPhoto',
});

module.exports = ApartmentPhoto;
