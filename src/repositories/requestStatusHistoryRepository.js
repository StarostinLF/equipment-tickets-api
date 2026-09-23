import { RequestStatusHistory } from '../db/models/index.js';

const ATTRIBUTES = ['id', 'requestId', 'previousStatus', 'newStatus', 'changedBy', 'comment', 'changedAt'];

function toDto(row) {
  const plain = row.get({ plain: true });
  return {
    id: plain.id,
    requestId: plain.requestId,
    previousStatus: plain.previousStatus,
    newStatus: plain.newStatus,
    changedBy: plain.changedBy,
    comment: plain.comment,
    changedAt: plain.changedAt,
  };
}

export const requestStatusHistoryRepository = {
  async findByRequestId(requestId) {
    const rows = await RequestStatusHistory.findAll({
      where: { requestId },
      attributes: ATTRIBUTES,
      order: [['changedAt', 'ASC']],
    });
    return rows.map(toDto);
  },

  async create(data, transaction) {
    return RequestStatusHistory.create(data, { transaction });
  },
};
