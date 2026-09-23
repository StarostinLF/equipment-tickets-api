import { sequelize } from '../../config/database.js';
import { defineSite } from './site.js';
import { defineEquipment } from './equipment.js';
import { defineEquipmentPassport } from './equipmentPassport.js';
import { defineTechnician } from './technician.js';
import { defineMaintenanceRequest } from './maintenanceRequest.js';
import { defineRequestStatusHistory } from './requestStatusHistory.js';
import { defineRequestAssignee } from './requestAssignee.js';

export const Site = defineSite(sequelize);
export const Equipment = defineEquipment(sequelize);
export const EquipmentPassport = defineEquipmentPassport(sequelize);
export const Technician = defineTechnician(sequelize);
export const MaintenanceRequest = defineMaintenanceRequest(sequelize);
export const RequestStatusHistory = defineRequestStatusHistory(sequelize);
export const RequestAssignee = defineRequestAssignee(sequelize);

Site.hasMany(Equipment, { foreignKey: 'siteId', as: 'equipment' });
Equipment.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });

Equipment.hasOne(EquipmentPassport, { foreignKey: 'equipmentId', as: 'passport' });
EquipmentPassport.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

Equipment.hasMany(MaintenanceRequest, { foreignKey: 'equipmentId', as: 'requests' });
MaintenanceRequest.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

MaintenanceRequest.hasMany(RequestStatusHistory, { foreignKey: 'requestId', as: 'statusHistory' });
RequestStatusHistory.belongsTo(MaintenanceRequest, { foreignKey: 'requestId', as: 'request' });

MaintenanceRequest.hasMany(RequestAssignee, { foreignKey: 'requestId', as: 'assignees' });
RequestAssignee.belongsTo(MaintenanceRequest, { foreignKey: 'requestId', as: 'request' });

Technician.hasMany(RequestAssignee, { foreignKey: 'technicianId', as: 'assignments' });
RequestAssignee.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });

MaintenanceRequest.belongsToMany(Technician, {
  through: RequestAssignee,
  foreignKey: 'requestId',
  otherKey: 'technicianId',
  as: 'technicians',
});
Technician.belongsToMany(MaintenanceRequest, {
  through: RequestAssignee,
  foreignKey: 'technicianId',
  otherKey: 'requestId',
  as: 'requests',
});

export { sequelize };
