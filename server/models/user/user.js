const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'Username has been taken',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your username',
      },
    },
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your fullname',
      },
    },
  },
  role: {
    type: DataTypes.ENUM("superadmin", "admin", "user"),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your role',
      },
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your password',
      },
    },
  },
}, {
  sequelize,
  paranoid: true,
  underscored: true,
  timestamps: true,
  modelName: 'user',
  indexes: [
    {
      unique: true,
      fields: ["username"],
    },
  ],
});

module.exports = User;