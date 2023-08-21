const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('lands', 'ownership', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('lands', 'ownership', {
      type: DataTypes.ENUM("Leasehold", "Freehold"),
      allowNull: true,
    });
  },
};
