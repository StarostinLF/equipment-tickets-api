import { siteRepository } from '../repositories/siteRepository.js';
import { NotFoundError } from '../errors/index.js';

export const siteService = {
  async getSummary(id) {
    const site = await siteRepository.findById(id);
    if (!site) {
      throw new NotFoundError('Площадка не найдена');
    }
    return siteRepository.getSummary(id);
  },
};
