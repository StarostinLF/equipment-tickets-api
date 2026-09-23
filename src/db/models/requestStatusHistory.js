import { DataTypes } from 'sequelize';
import { REQUEST_STATUSES } from '../../validators/requestSchemas.js';

export function defineRequestStatusHistory(sequelize) {
  return sequelize.define(
    'RequestStatusHistory',
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      requestId: { type: DataTypes.UUID, allowNull: false },
      previousStatus: { type: DataTypes.ENUM(...REQUEST_STATUSES), allowNull: false },
      newStatus: { type: DataTypes.ENUM(...REQUEST_STATUSES), allowNull: false },
      changedBy: { type: DataTypes.STRING(150), allowNull: true },
      comment: { type: DataTypes.TEXT, allowNull: true },
      changedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { tableName: 'request_status_history', timestamps: false },
  );
}
