import { DataTypes } from 'sequelize';

export const ASSIGNEE_ROLES = ['lead', 'member'];

export function defineRequestAssignee(sequelize) {
  return sequelize.define(
    'RequestAssignee',
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      requestId: { type: DataTypes.UUID, allowNull: false },
      technicianId: { type: DataTypes.UUID, allowNull: false },
      role: { type: DataTypes.ENUM(...ASSIGNEE_ROLES), allowNull: false },
      plannedHours: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    },
    { tableName: 'request_assignees' },
  );
}
