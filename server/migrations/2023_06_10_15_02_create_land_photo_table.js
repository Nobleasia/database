const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("land_photos", {
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
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter land\'s photo filepath',
          },
        },
      },
      photo_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter land\'s photo url',
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
    await queryInterface.dropTable("land_photos");
  },
};
