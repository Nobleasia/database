const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("logs", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: {
          args: true,
          msg: 'Log ID has been taken',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Log ID can\'t be empty',
          },
        },
      },
      status_code: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Log status code can\'t be empty',
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Log message can\'t be empty',
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      expires_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set expires_at to 30 days from now as default
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Log expiry time can\'t be empty',
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
    await queryInterface.dropTable("logs");
  },
}