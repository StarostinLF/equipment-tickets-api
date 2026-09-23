import { RequestAssignee } from '../db/models/index.js';

export const requestAssigneeRepository = {
  async countByRequestId(requestId, transaction) {
    return RequestAssignee.count({ where: { requestId }, transaction });
  },
};
