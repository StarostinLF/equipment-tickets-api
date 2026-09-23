import { sequelize } from '../config/database.js';
import { requestRepository } from '../repositories/requestRepository.js';
import { requestStatusHistoryRepository } from '../repositories/requestStatusHistoryRepository.js';
import { requestAssigneeRepository } from '../repositories/requestAssigneeRepository.js';
import { equipmentService } from './equipmentService.js';
import { NotFoundError, ConflictError } from '../errors/index.js';

const ALLOWED_TRANSITIONS = {
  new: ['in_progress', 'rejected'],
  in_progress: ['done', 'rejected'],
  done: [],
  rejected: [],
};

export const requestService = {
  async list(query) {
    const { items, total } = await requestRepository.findAll(query);
    return { items, total, page: query.page, limit: query.limit };
  },

  async listByEquipment(equipmentId, query) {
    await equipmentService.getById(equipmentId);
    const { items, total } = await requestRepository.findAll({ ...query, equipmentId });
    return { items, total, page: query.page, limit: query.limit };
  },

  async getById(id) {
    const request = await requestRepository.findById(id);
    if (!request) {
      throw new NotFoundError('Заявка не найдена');
    }
    return request;
  },

  async getHistory(id) {
    await this.getById(id);
    return requestStatusHistoryRepository.findByRequestId(id);
  },

  async create(data) {
    await equipmentService.getById(data.equipmentId);
    return requestRepository.create(data);
  },

  async update(id, patch) {
    await this.getById(id);

    if (patch.equipmentId) {
      await equipmentService.getById(patch.equipmentId);
    }

    return requestRepository.update(id, patch);
  },

  async updateStatus(id, nextStatus, { changedBy, comment } = {}) {
    return sequelize.transaction(async (transaction) => {
      const request = await requestRepository.lockById(id, transaction);
      if (!request) {
        throw new NotFoundError('Заявка не найдена');
      }

      const currentStatus = request.status;
      const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];
      if (!allowed.includes(nextStatus)) {
        throw new ConflictError(`Недопустимый переход статуса: ${currentStatus} -> ${nextStatus}`);
      }

      if (nextStatus === 'in_progress') {
        const assigneeCount = await requestAssigneeRepository.countByRequestId(id, transaction);
        if (assigneeCount === 0) {
          throw new ConflictError('Нельзя перевести заявку в работу без назначенных исполнителей');
        }
      }

      const updated = await requestRepository.update(id, { status: nextStatus }, { transaction });

      await requestStatusHistoryRepository.create(
        {
          requestId: id,
          previousStatus: currentStatus,
          newStatus: nextStatus,
          changedBy: changedBy ?? null,
          comment: comment ?? null,
        },
        transaction,
      );

      return updated;
    });
  },

  async remove(id) {
    await this.getById(id);
    await requestRepository.remove(id);
  },
};
