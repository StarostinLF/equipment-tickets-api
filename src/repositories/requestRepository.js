import { Op } from 'sequelize';
import { MaintenanceRequest, RequestAssignee, Technician } from '../db/models/index.js';

const ATTRIBUTES = [
  'id', 'equipmentId', 'title', 'description', 'priority', 'status', 'plannedAt', 'author', 'createdAt', 'updatedAt',
];
const OPEN_STATUSES = ['new', 'in_progress'];

const ASSIGNEE_INCLUDE = {
  model: RequestAssignee,
  as: 'assignees',
  attributes: ['technicianId', 'role', 'plannedHours'],
  include: [{ model: Technician, as: 'technician', attributes: ['fullName'] }],
};

function toAssigneeDto(row) {
  return {
    technicianId: row.technicianId,
    fullName: row.technician?.fullName ?? null,
    role: row.role,
    plannedHours: Number(row.plannedHours),
  };
}

function toDto(request, assigneesOverride) {
  if (!request) return null;
  const plain = request.get({ plain: true });
  const assignees = assigneesOverride ?? plain.assignees ?? [];
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
    assignees: assignees.map(toAssigneeDto),
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
      include: [ASSIGNEE_INCLUDE],
      order: [[sort, order.toUpperCase()]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return { items: rows.map((row) => toDto(row)), total: count };
  },

  async findById(id) {
    const request = await MaintenanceRequest.findByPk(id, { attributes: ATTRIBUTES, include: [ASSIGNEE_INCLUDE] });
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
    return toDto(request, []);
  },

  async update(id, patch, options = {}) {
    const [count, [request]] = await MaintenanceRequest.update(patch, {
      where: { id },
      returning: true,
      ...options,
    });
    if (count === 0) return null;

    const assignees = await RequestAssignee.findAll({
      where: { requestId: id },
      attributes: ['technicianId', 'role', 'plannedHours'],
      include: [{ model: Technician, as: 'technician', attributes: ['fullName'] }],
      transaction: options.transaction,
    });
    return toDto(request, assignees);
  },

  async remove(id) {
    const count = await MaintenanceRequest.destroy({ where: { id } });
    return count > 0;
  },
};
