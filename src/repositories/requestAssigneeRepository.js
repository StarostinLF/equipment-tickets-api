import { RequestAssignee } from '../db/models/index.js';

export const requestAssigneeRepository = {
  async countByRequestId(requestId, transaction) {
    return RequestAssignee.count({ where: { requestId }, transaction });
  },

  async replaceTeam(requestId, assignees, transaction) {
    await RequestAssignee.destroy({ where: { requestId }, transaction });
    await RequestAssignee.bulkCreate(
      assignees.map((assignee) => ({
        requestId,
        technicianId: assignee.technicianId,
        role: assignee.role,
        plannedHours: assignee.plannedHours,
      })),
      { transaction },
    );
  },

  async removeOne(requestId, technicianId) {
    const count = await RequestAssignee.destroy({ where: { requestId, technicianId } });
    return count > 0;
  },
};
