import { Op } from 'sequelize';
import { MaintenanceRequest } from '../db/models/index.js';

const ATTRIBUTES = [
  'id', 'equipmentId', 'title', 'description', 'priority', 'status', 'plannedAt', 'author', 'createdAt', 'updatedAt',
];
const OPEN_STATUSES = ['new', 'in_progress'];

function toDto(request) {
  if (!request) return null;
  const plain = request.get({ plain: true });
  return {
    id: plain.id,
    equipmentId: plain.equipmentId,
    title: plain.title,
    description: plain.description,
    priority: plain.priority,
    status: plain.status,
    plannedAt: plain.plannedAt,
    author: plain.author,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

export const requestRepository = {
  async findAll({ equipmentId, status, priority, createdFrom, createdTo, sort, order, page, limit }) {
    const where = {};
    if (equipmentId) where.equipmentId = equipmentId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    const { rows, count } = await MaintenanceRequest.findAndCountAll({
      where,
      attributes: ATTRIBUTES,
      order: [[sort, order.toUpperCase()]],
      limit,
      offset: (page - 1) * limit,
    });

    return { items: rows.map(toDto), total: count };
  },

  async findById(id) {
    const request = await MaintenanceRequest.findByPk(id, { attributes: ATTRIBUTES });
    return toDto(request);
  },

  async lockById(id, transaction) {
    return MaintenanceRequest.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
  },

  async hasOpenByEquipmentId(equipmentId) {
    const count = await MaintenanceRequest.count({
      where: { equipmentId, status: { [Op.in]: OPEN_STATUSES } },
    });
    return count > 0;
  },

  async create(data) {
    const request = await MaintenanceRequest.create({ ...data, status: 'new' });
    return toDto(request);
  },

  async update(id, patch, options = {}) {
    const [count, [request]] = await MaintenanceRequest.update(patch, {
      where: { id },
      returning: true,
      ...options,
    });
    return count > 0 ? toDto(request) : null;
  },

  async remove(id) {
    const count = await MaintenanceRequest.destroy({ where: { id } });
    return count > 0;
  },
};
