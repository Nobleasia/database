const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('property_partialans', 'property_type', {
      type: DataTypes.ENUM('Apartment', 'Home', 'Land', 'Office'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Property Partialan property type can\'t be empty',
        },
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('property_partialans', 'property_type');
  }
};
