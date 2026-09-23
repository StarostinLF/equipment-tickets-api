import { DataTypes } from 'sequelize';
import { REQUEST_PRIORITIES, REQUEST_STATUSES } from '../../validators/requestSchemas.js';

export function defineMaintenanceRequest(sequelize) {
  return sequelize.define(
    'MaintenanceRequest',
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      equipmentId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING(120), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      priority: { type: DataTypes.ENUM(...REQUEST_PRIORITIES), allowNull: false },
      status: { type: DataTypes.ENUM(...REQUEST_STATUSES), allowNull: false, defaultValue: 'new' },
      plannedAt: { type: DataTypes.DATE, allowNull: true },
      author: { type: DataTypes.STRING(150), allowNull: true },
    },
    { tableName: 'maintenance_requests' },
  );
}
