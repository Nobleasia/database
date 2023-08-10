const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class LandPhoto extends Model { }

LandPhoto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  land_kode_propar: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter land\'s kode propar',
      },
    },
    references: { model: 'lands', key: 'kode_propar' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  photo_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter land\'s photo filepath',
      },
    },
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter land\'s photo url',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'LandPhoto',
});

module.exports = LandPhoto;
