const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("offices", {
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
      wht_percentage: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      wht_is_included: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      lease_term_time: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      lease_term_type: {
        type: DataTypes.ENUM('Month', 'Year'),
        allowNull: true,
      },
      parking_ratio: {
        type: DataTypes.INTEGER.UNSIGNED,
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
    await queryInterface.dropTable("offices");
  }
};
