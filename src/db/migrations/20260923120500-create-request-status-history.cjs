'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_status_history', {
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
      previous_status: {
        type: Sequelize.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: false,
      },
      new_status: {
        type: Sequelize.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: false,
      },
      changed_by: { type: Sequelize.STRING(150), allowNull: true },
      comment: { type: Sequelize.TEXT, allowNull: true },
      changed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });

    await queryInterface.addIndex('request_status_history', ['request_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('request_status_history');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_request_status_history_previous_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_request_status_history_new_status";');
  },
};
