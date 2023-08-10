const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("home_facilities", {
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
      property_facility_name_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter property facility name id',
          },
        },
        references: { model: 'property_facility_names', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable("home_facilities");
  },
};
