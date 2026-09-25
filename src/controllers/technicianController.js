import { technicianService } from '../services/technicianService.js';

export const technicianController = {
  async list(req, res) {
    const technicians = await technicianService.list();
    res.json({ data: technicians });
  },
};
