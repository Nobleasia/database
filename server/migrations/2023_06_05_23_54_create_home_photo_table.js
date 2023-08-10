const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("home_photos", {
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
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter house\'s photo filepath',
          },
        },
      },
      photo_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter house\'s photo url',
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
    await queryInterface.dropTable("home_photos");
  },
};
