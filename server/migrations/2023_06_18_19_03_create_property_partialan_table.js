const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("property_partialans", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: {
          args: true,
          msg: 'Property Partialan ID has been taken',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Property Partialan ID can\'t be empty',
          },
        },
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Property Partialan content can\'t be empty',
          },
        },
      },
      expires_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expires_at to 7 days from now as default
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Property Partialan expiry time can\'t be empty',
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
    }, {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["id"]
        }
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("property_partialans");
  },
}