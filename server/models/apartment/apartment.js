const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class Apartment extends Model { }

Apartment.init({
  kode_propar: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    unique: {
      args: true,
      msg: 'kode propar has been taken',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s kode propar',
      },
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment name',
      },
    },
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  property_area_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_areas', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  size: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  floor: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tower: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  furnishing: {
    type: DataTypes.ENUM('Fully Furnished', 'Semi Furnished', 'Unfurnished'),
    allowNull: true,
  },
  bedroom: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bathroom: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  study_room: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    get() {
      if (!(this.getDataValue('available') === true || this.getDataValue('available') === false)) return null;
      return this.getDataValue('available') ? 'Yes' : 'No';
    }
  },
  price_currency: {
    type: DataTypes.ENUM('Rupiah', 'US Dollar'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s price currency',
      },
    },
  },
  rental_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s rental price',
      },
    },
  },
  selling_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter apartment\'s selling price',
      },
    },
  },
  property_payment_term_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_payment_terms', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  vat_percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vat_is_included: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  vat_details: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.vat_percentage) {
        if (this.vat_is_included) return `${this.vat_percentage}% VAT Included within Price`;
        return `${this.vat_percentage}% VAT Excluded from Price`;
      }
      return null;
    }
  },
  wht_percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  wht_is_included: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  wht_details: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.wht_percentage) {
        if (this.wht_is_included) return `${this.wht_percentage}% WHT Included within Price`;
        return `${this.wht_percentage}% WHT Excluded from Price`;
      }
      return null;
    }
  },
  lease_term_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lease_term_type: {
    type: DataTypes.ENUM('Month', 'Year'),
    allowNull: true,
  },
  lease_term_details: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.lease_term_time ? `${this.lease_term_time} ${this.lease_term_type}(s)` : null;
    }
  },
  property_person_in_charge_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_person_in_charges', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  remarks_1: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  remarks_2: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  remarks_3: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  modelName: 'Apartment',
  indexes: [
    {
      unique: true,
      fields: ["kode_propar"],
    },
  ],
});

module.exports = Apartment;
