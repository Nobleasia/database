const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class OfficePhoto extends Model { }

OfficePhoto.init({
  id: {
    type: DataTypes.INTEGER,
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
  photo_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s photo filepath',
      },
    },
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s photo url',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'OfficePhoto',
});

module.exports = OfficePhoto;
