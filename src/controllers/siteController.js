import { siteService } from '../services/siteService.js';

export const siteController = {
  async getSummary(req, res) {
    const summary = await siteService.getSummary(req.params.id);
    res.json({ data: { siteId: req.params.id, ...summary } });
  },
};
