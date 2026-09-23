'use strict';

const UNIQUE_CONSTRAINT = 'request_assignees_request_id_technician_id_key';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_assignees', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'maintenance_requests', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      technician_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'technicians', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      role: { type: Sequelize.ENUM('lead', 'member'), allowNull: false },
      planned_hours: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });

    await queryInterface.addConstraint('request_assignees', {
      fields: ['request_id', 'technician_id'],
      type: 'unique',
      name: UNIQUE_CONSTRAINT,
    });
    await queryInterface.addIndex('request_assignees', ['request_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('request_assignees');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_request_assignees_role";');
  },
};
