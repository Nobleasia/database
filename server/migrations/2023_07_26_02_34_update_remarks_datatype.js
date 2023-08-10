const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    // For apartments table
    await queryInterface.changeColumn('apartments', 'remarks_1', {
      type: DataTypes.TEXT('long'),
      allowNull: true, // Set to false if you want to disallow null values
    });

    await queryInterface.changeColumn('apartments', 'remarks_2', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('apartments', 'remarks_3', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    // For homes table
    await queryInterface.changeColumn('homes', 'remarks_1', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('homes', 'remarks_2', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('homes', 'remarks_3', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    // For lands table
    await queryInterface.changeColumn('lands', 'remarks_1', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('lands', 'remarks_2', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('lands', 'remarks_3', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    // For offices table
    await queryInterface.changeColumn('offices', 'remarks_1', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('offices', 'remarks_2', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.changeColumn('offices', 'remarks_3', {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    // For apartments table
    await queryInterface.changeColumn('apartments', 'remarks_1', {
      type: DataTypes.STRING(255),
      allowNull: true, // Set to false if you want to disallow null values
    });

    await queryInterface.changeColumn('apartments', 'remarks_2', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('apartments', 'remarks_3', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    // For homes table
    await queryInterface.changeColumn('homes', 'remarks_1', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('homes', 'remarks_2', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('homes', 'remarks_3', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    // For lands table
    await queryInterface.changeColumn('lands', 'remarks_1', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('lands', 'remarks_2', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('lands', 'remarks_3', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    // For offices table
    await queryInterface.changeColumn('offices', 'remarks_1', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('offices', 'remarks_2', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('offices', 'remarks_3', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  }
};
