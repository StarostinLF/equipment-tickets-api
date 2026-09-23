import { Equipment } from '../db/models/index.js';

const ATTRIBUTES = ['id', 'siteId', 'name', 'type', 'serialNumber', 'status', 'lat', 'lon', 'installedAt'];

function toDto(equipment) {
  if (!equipment) return null;
  const plain = equipment.get({ plain: true });
  return {
    id: plain.id,
    siteId: plain.siteId,
    name: plain.name,
    type: plain.type,
    serialNumber: plain.serialNumber,
    status: plain.status,
    location: { lat: Number(plain.lat), lon: Number(plain.lon) },
    installedAt: plain.installedAt,
  };
}

function toModelValues({ location, ...rest }) {
  const values = { ...rest };
  if (location) {
    values.lat = location.lat;
    values.lon = location.lon;
  }
  return values;
}

export const equipmentRepository = {
  async findAll({ type, status, sort, order, page, limit }) {
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const { rows, count } = await Equipment.findAndCountAll({
      where,
      attributes: ATTRIBUTES,
      order: [[sort, order.toUpperCase()]],
      limit,
      offset: (page - 1) * limit,
    });

    return { items: rows.map(toDto), total: count };
  },

  async findById(id) {
    const equipment = await Equipment.findByPk(id, { attributes: ATTRIBUTES });
    return toDto(equipment);
  },

  async findBySerialNumber(serialNumber) {
    const equipment = await Equipment.findOne({ where: { serialNumber }, attributes: ATTRIBUTES });
    return toDto(equipment);
  },

  async create(data) {
    const equipment = await Equipment.create(toModelValues(data));
    return toDto(equipment);
  },

  async update(id, patch) {
    const [count, [equipment]] = await Equipment.update(toModelValues(patch), {
      where: { id },
      returning: true,
    });
    return count > 0 ? toDto(equipment) : null;
  },

  async remove(id) {
    const count = await Equipment.destroy({ where: { id } });
    return count > 0;
  },
};
