const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("apartment_photos", {
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
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("apartment_photos");
  },
};
