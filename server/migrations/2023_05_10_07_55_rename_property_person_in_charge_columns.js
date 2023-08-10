module.exports = {
  up: async ({ context: queryInterface }) => {
    // Ubah nama kolom property_person_in_charge_roles_id menjadi property_person_in_charge_role_id
    await queryInterface.renameColumn('property_person_in_charges', 'property_person_in_charge_roles_id', 'property_person_in_charge_role_id');
    await queryInterface.renameColumn('property_person_in_charges', 'property_person_in_charge_companies_id', 'property_person_in_charge_company_id');
  },

  down: async ({ context: queryInterface }) => {
    // Kembalikan nama kolom property_person_in_charge_role_id menjadi property_person_in_charge_roles_id
    await queryInterface.renameColumn('property_person_in_charges', 'property_person_in_charge_role_id', 'property_person_in_charge_roles_id');
    await queryInterface.renameColumn('property_person_in_charges', 'property_person_in_charge_company_id', 'property_person_in_charge_companies_id');
  }
};
