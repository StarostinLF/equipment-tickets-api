import { DataTypes } from 'sequelize';

export function defineSite(sequelize) {
  return sequelize.define(
    'Site',
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      region: { type: DataTypes.STRING(150), allowNull: false },
      lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
      lon: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    },
    { tableName: 'sites' },
  );
}
