import { technicianRepository } from '../repositories/technicianRepository.js';

export const technicianService = {
  async list() {
    return technicianRepository.findAll();
  },
};
