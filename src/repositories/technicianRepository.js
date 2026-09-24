import { Technician } from '../db/models/index.js';

export const technicianRepository = {
  async findAllByIds(ids, transaction) {
    return Technician.findAll({ where: { id: ids }, attributes: ['id'], transaction });
  },
};
