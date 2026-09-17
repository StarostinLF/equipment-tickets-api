import { equipmentRepository } from '../repositories/equipmentRepository.js';
import { ConflictError, NotFoundError } from '../errors/index.js';

async function assertSerialNumberIsFree(serialNumber, excludeId) {
  const existing = await equipmentRepository.findBySerialNumber(serialNumber);
  if (existing && existing.id !== excludeId) {
    throw new ConflictError('Серийный номер уже используется', [
      { field: 'serialNumber', message: 'Значение должно быть уникальным' },
    ]);
  }
}

export const equipmentService = {
  async list(query) {
    const { items, total } = await equipmentRepository.findAll(query);
    return { items, total, page: query.page, limit: query.limit };
  },

  async getById(id) {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError('Оборудование не найдено');
    }
    return equipment;
  },

  async create(data) {
    await assertSerialNumberIsFree(data.serialNumber);
    return equipmentRepository.create(data);
  },

  async update(id, patch) {
    await this.getById(id);

    if (patch.serialNumber) {
      await assertSerialNumberIsFree(patch.serialNumber, id);
    }

    return equipmentRepository.update(id, patch);
  },

  async remove(id) {
    await this.getById(id);
    // Запрет удаления при наличии открытых заявок добавится вместе
    // с requestRepository в ветке feat/requests-crud.
    await equipmentRepository.remove(id);
  },
};
