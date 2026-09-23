import { DataTypes } from 'sequelize';

export function defineEquipmentPassport(sequelize) {
  return sequelize.define(
    'EquipmentPassport',
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      equipmentId: { type: DataTypes.UUID, allowNull: false, unique: true },
      manufacturer: { type: DataTypes.STRING(150), allowNull: false },
      model: { type: DataTypes.STRING(150), allowNull: false },
      ratedPower: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      lastInspectionDate: { type: DataTypes.DATEONLY, allowNull: true },
    },
    { tableName: 'equipment_passports' },
  );
}
