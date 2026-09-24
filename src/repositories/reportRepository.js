import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const EQUIPMENT_LOAD_SQL = `
  SELECT
    e.id AS "equipmentId",
    e.name AS "equipmentName",
    COUNT(DISTINCT mr.id) AS "requestsCount",
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.status IN ('done', 'rejected')) AS "closedRequestsCount",
    COALESCE(SUM(ra.planned_hours), 0) AS "totalPlannedHours",
    MAX(mr.updated_at) FILTER (WHERE mr.status = 'done') AS "lastMaintenanceAt"
  FROM equipment e
  LEFT JOIN maintenance_requests mr
    ON mr.equipment_id = e.id
    AND ($1::timestamptz IS NULL OR mr.created_at >= $1)
    AND ($2::timestamptz IS NULL OR mr.created_at <= $2)
  LEFT JOIN request_assignees ra ON ra.request_id = mr.id
  GROUP BY e.id, e.name
  HAVING COUNT(DISTINCT mr.id) >= $3
  ORDER BY e.name ASC
`;

export const reportRepository = {
  async getEquipmentLoad({ createdFrom, createdTo, minRequests }) {
    const rows = await sequelize.query(EQUIPMENT_LOAD_SQL, {
      bind: [createdFrom ?? null, createdTo ?? null, minRequests],
      type: QueryTypes.SELECT,
    });

    return rows.map((row) => ({
      equipmentId: row.equipmentId,
      equipmentName: row.equipmentName,
      requestsCount: Number(row.requestsCount),
      closedRequestsCount: Number(row.closedRequestsCount),
      totalPlannedHours: Number(row.totalPlannedHours),
      lastMaintenanceAt: row.lastMaintenanceAt,
    }));
  },
};
