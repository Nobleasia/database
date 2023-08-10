const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("property_person_in_charge_roles", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        unique: {
          args: true,
          msg: 'PIC role name is already exist in the table',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter PIC role name',
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
      }
    },
      {
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["name"],
          },
        },
      });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("property_person_in_charge_roles");
  },
};
