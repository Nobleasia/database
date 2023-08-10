const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("users", {
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
            fields: ["username"],
          },
        },
      });

    await queryInterface.createTable("session_blacklists", {
      jwtid: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: {
          args: true,
          msg: 'UUID blacklist has been taken',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter blacklisted token UUID',
          },
        },
      },
      refresh_token: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter user\'s refresh token',
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        validate: {
          notNull: {
            msg: 'Please enter user\'s id',
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
    },
      {
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["jwtid"],
          },
        },
      });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("session_blacklists");
    await queryInterface.dropTable("users");
  }
};
