const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("apartment_facilities", {
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
    await queryInterface.dropTable("apartment_facilities");
  },
};
