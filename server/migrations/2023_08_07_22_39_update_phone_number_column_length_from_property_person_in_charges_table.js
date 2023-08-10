const DataTypes = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('property_person_in_charges', 'phone_number', {
      type: DataTypes.STRING(255),
      allowNull: true, // Set to false if you want to disallow null values
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('property_person_in_charges', 'phone_number', {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter property\'s person in charge phone number',
        },
      },
    });
  },
};
