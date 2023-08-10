const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class HomePhoto extends Model { }

HomePhoto.init({
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
  photo_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter house\'s photo filepath',
      },
    },
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter house\'s photo url',
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'HomePhoto',
});

module.exports = HomePhoto;
