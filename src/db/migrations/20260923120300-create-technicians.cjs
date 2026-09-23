'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('technicians', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      full_name: { type: Sequelize.STRING(150), allowNull: false },
      specialization: { type: Sequelize.STRING(100), allowNull: false },
      personnel_number: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('technicians');
  },
};
