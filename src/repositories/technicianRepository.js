import { Technician } from '../db/models/index.js';

function toDto(technician) {
  const plain = technician.get({ plain: true });
  return {
    id: plain.id,
    fullName: plain.fullName,
    specialization: plain.specialization,
    personnelNumber: plain.personnelNumber,
  };
}

export const technicianRepository = {
  async findAll() {
    const technicians = await Technician.findAll({
      attributes: ['id', 'fullName', 'specialization', 'personnelNumber'],
      order: [['fullName', 'ASC']],
    });
    return technicians.map(toDto);
  },

  async findAllByIds(ids, transaction) {
    return Technician.findAll({ where: { id: ids }, attributes: ['id'], transaction });
  },
};
