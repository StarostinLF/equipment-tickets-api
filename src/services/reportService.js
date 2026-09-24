import { reportRepository } from '../repositories/reportRepository.js';

export const reportService = {
  async getEquipmentLoad(query) {
    return reportRepository.getEquipmentLoad(query);
  },
};
