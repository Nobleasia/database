const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("lands", {
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
            msg: 'Please enter land\'s kode propar',
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
      land_size: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      ownership: {
        type: DataTypes.ENUM('Leasehold', 'Freehold'),
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
      zone: {
        type: DataTypes.ENUM('Red', 'Yellow', 'Green'),
        allowNull: true,
      },
      surroundings: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      property_person_in_charge_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'property_person_in_charges', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      price: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter land\'s price',
          },
        },
      },
      price_currency: {
        type: DataTypes.ENUM('Rupiah', 'US Dollar'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter land\'s price currency',
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
      wht_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wht_is_included: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      lease_term_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lease_term_type: {
        type: DataTypes.ENUM('Month', 'Year'),
        allowNull: true,
      },
      remarks_1: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remarks_2: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remarks_3: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["kode_propar"],
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("lands");
  },
};
