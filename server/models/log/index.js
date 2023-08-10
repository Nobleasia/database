const { Model, DataTypes } = require('sequelize');

const { sequelize } = require("../../utils/db");

class Log extends Model { }

Log.init({
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
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Log',
  indexes: [
    {
      unique: true,
      fields: ["id"],
    },
  ],
});

module.exports = Log;
