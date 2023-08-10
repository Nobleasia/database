const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class Office extends Model { }

Office.init({
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
        msg: 'Please enter office\'s kode propar',
      },
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office name',
      },
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  property_area_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_areas', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  building_completion: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  certificates: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  grade: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  floor: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  condition: {
    type: DataTypes.ENUM('Bare', 'Semi Fitted', 'Fitted'),
    allowNull: true,
  },
  semi_gross_area: {
    type: DataTypes.INTEGER.UNSIGNED,
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
  property_person_in_charge_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_person_in_charges', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  price_currency: {
    type: DataTypes.ENUM('Rupiah', 'US Dollar'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s price currency',
      },
    },
  },
  rental_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s rental price',
      },
    },
  },
  selling_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s selling price',
      },
    },
  },
  service_charge_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s service charge price',
      },
    },
  },
  service_charge_time: {
    type: DataTypes.ENUM('Month', 'Year'),
    allowNull: true,
  },
  service_charge_details: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.service_charge_time && this.service_charge_price ? `${this.service_charge_price}/${this.service_charge_time}(s)` : null;
    },
  },
  overtime_price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter office\'s overtime price',
      },
    },
  },
  overtime_time: {
    type: DataTypes.ENUM('Hour', 'Day'),
    allowNull: true,
  },
  overtime_details: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.overtime_time && this.overtime_price ? `${this.overtime_price}/${this.overtime_time}(s)` : null;
    },
  },
  security_deposit: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  property_payment_term_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'property_payment_terms', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  vat_percentage: {
    type: DataTypes.INTEGER.UNSIGNED,
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
    type: DataTypes.INTEGER.UNSIGNED,
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
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  lease_term_type: {
    type: DataTypes.ENUM('Month', 'Year'),
    allowNull: true,
  },
  lease_term_details: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.lease_term_time && this.lease_term_type ? `${this.lease_term_time} ${this.lease_term_type}(s)` : null;
    }
  },
  parking_ratio: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
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
  modelName: 'Office',
  indexes: [
    {
      unique: true,
      fields: ["kode_propar"],
    },
  ],
});

module.exports = Office;
