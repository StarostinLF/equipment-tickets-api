import { Equipment, EquipmentPassport } from '../db/models/index.js';

const ATTRIBUTES = ['id', 'siteId', 'name', 'type', 'serialNumber', 'status', 'lat', 'lon', 'installedAt'];
const PASSPORT_ATTRIBUTES = ['manufacturer', 'model', 'ratedPower', 'lastInspectionDate'];
const PASSPORT_INCLUDE = { model: EquipmentPassport, as: 'passport', attributes: PASSPORT_ATTRIBUTES };

function toPassportDto(passport) {
  if (!passport) return null;
  const plain = passport.get ? passport.get({ plain: true }) : passport;
  return {
    manufacturer: plain.manufacturer,
    model: plain.model,
    ratedPower: Number(plain.ratedPower),
    lastInspectionDate: plain.lastInspectionDate,
  };
}

function toDto(equipment, passport) {
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
    passport: passport !== undefined ? toPassportDto(passport) : toPassportDto(plain.passport),
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
      include: [PASSPORT_INCLUDE],
      order: [[sort, order.toUpperCase()]],
      limit,
      offset: (page - 1) * limit,
    });

    return { items: rows.map((row) => toDto(row)), total: count };
  },

  async findById(id) {
    const equipment = await Equipment.findByPk(id, { attributes: ATTRIBUTES, include: [PASSPORT_INCLUDE] });
    return toDto(equipment);
  },

  async findBySerialNumber(serialNumber) {
    const equipment = await Equipment.findOne({ where: { serialNumber }, attributes: ATTRIBUTES });
    return toDto(equipment);
  },

  async create(data) {
    const equipment = await Equipment.create(toModelValues(data));
    return toDto(equipment, null);
  },

  async update(id, patch) {
    const [count, [equipment]] = await Equipment.update(toModelValues(patch), {
      where: { id },
      returning: true,
    });
    if (count === 0) return null;
    const passport = await EquipmentPassport.findOne({
      where: { equipmentId: id },
      attributes: PASSPORT_ATTRIBUTES,
    });
    return toDto(equipment, passport);
  },

  async remove(id) {
    const count = await Equipment.destroy({ where: { id } });
    return count > 0;
  },
};
