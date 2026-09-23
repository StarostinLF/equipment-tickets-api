import { fn, col, literal } from 'sequelize';
import { Site, Equipment, MaintenanceRequest } from '../db/models/index.js';
import { REQUEST_STATUSES, REQUEST_PRIORITIES } from '../validators/requestSchemas.js';

const CLOSED_STATUSES = ['done', 'rejected'];

function zeroMap(keys) {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

export const siteRepository = {
  async findById(id) {
    return Site.findByPk(id, { attributes: ['id'] });
  },

  async getSummary(siteId) {
    const equipmentFilter = { model: Equipment, as: 'equipment', attributes: [], where: { siteId } };

    const statusRows = await MaintenanceRequest.findAll({
      attributes: [[col('MaintenanceRequest.status'), 'status'], [fn('COUNT', col('MaintenanceRequest.id')), 'count']],
      include: [equipmentFilter],
      group: [col('MaintenanceRequest.status')],
      raw: true,
    });

    const priorityRows = await MaintenanceRequest.findAll({
      attributes: [[col('MaintenanceRequest.priority'), 'priority'], [fn('COUNT', col('MaintenanceRequest.id')), 'count']],
      include: [equipmentFilter],
      group: [col('MaintenanceRequest.priority')],
      raw: true,
    });

    const [averageRow] = await MaintenanceRequest.findAll({
      attributes: [[fn('AVG', literal('EXTRACT(EPOCH FROM ("MaintenanceRequest"."updated_at" - "MaintenanceRequest"."created_at"))')), 'avgSeconds']],
      include: [equipmentFilter],
      where: { '$MaintenanceRequest.status$': CLOSED_STATUSES },
      raw: true,
    });

    const requestsByStatus = zeroMap(REQUEST_STATUSES);
    for (const row of statusRows) requestsByStatus[row.status] = Number(row.count);

    const requestsByPriority = zeroMap(REQUEST_PRIORITIES);
    for (const row of priorityRows) requestsByPriority[row.priority] = Number(row.count);

    const avgSeconds = averageRow?.avgSeconds != null ? Number(averageRow.avgSeconds) : null;

    return {
      requestsByStatus,
      requestsByPriority,
      averageClosingTimeHours: avgSeconds != null ? Number((avgSeconds / 3600).toFixed(2)) : null,
    };
  },
};
