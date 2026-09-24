import { reportService } from '../services/reportService.js';

export const reportController = {
  async getEquipmentLoad(req, res) {
    const report = await reportService.getEquipmentLoad(req.validatedQuery);
    res.json({ data: report });
  },
};
