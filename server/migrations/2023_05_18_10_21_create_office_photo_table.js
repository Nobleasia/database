const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("office_photos", {
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
    await queryInterface.dropTable("office_photos");
  },
};
