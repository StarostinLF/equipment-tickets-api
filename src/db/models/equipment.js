import { DataTypes } from 'sequelize';
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES } from '../../validators/equipmentSchemas.js';

export function defineEquipment(sequelize) {
  return sequelize.define(
    'Equipment',
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      siteId: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      type: { type: DataTypes.ENUM(...EQUIPMENT_TYPES), allowNull: false },
      serialNumber: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      status: { type: DataTypes.ENUM(...EQUIPMENT_STATUSES), allowNull: false, defaultValue: 'operational' },
      lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
      lon: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
      installedAt: { type: DataTypes.DATEONLY, allowNull: false },
    },
    { tableName: 'equipment' },
  );
}
