import { DataTypes } from 'sequelize';

export function defineTechnician(sequelize) {
  return sequelize.define(
    'Technician',
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      fullName: { type: DataTypes.STRING(150), allowNull: false },
      specialization: { type: DataTypes.STRING(100), allowNull: false },
      personnelNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    },
    { tableName: 'technicians' },
  );
}
