import { requestRepository } from '../repositories/requestRepository.js';
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

  async updateStatus(id, nextStatus) {
    const request = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[request.status] ?? [];

    if (!allowed.includes(nextStatus)) {
      throw new ConflictError(`Недопустимый переход статуса: ${request.status} -> ${nextStatus}`);
    }

    return requestRepository.update(id, { status: nextStatus });
  },

  async remove(id) {
    await this.getById(id);
    await requestRepository.remove(id);
  },
};
