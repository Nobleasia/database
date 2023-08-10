const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("property_areas", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      region_name: {
        type: DataTypes.STRING(100),
        unique: {
          args: true,
          msg: 'region name is already exist in the table',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter region name',
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
    },
      {
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["region_name"],
          },
        },
      });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("property_areas");
  },
};
