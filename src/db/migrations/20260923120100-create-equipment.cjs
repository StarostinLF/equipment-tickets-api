'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM('turbine', 'inverter', 'sensor', 'substation'), allowNull: false },
      serial_number: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      status: {
        type: Sequelize.ENUM('operational', 'maintenance', 'fault', 'decommissioned'),
        allowNull: false,
        defaultValue: 'operational',
      },
      lat: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
      lon: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
      installed_at: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });

    await queryInterface.addIndex('equipment', ['site_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equipment');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_equipment_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_equipment_status";');
  },
};
