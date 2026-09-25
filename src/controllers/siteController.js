import { siteService } from '../services/siteService.js';

export const siteController = {
  async list(req, res) {
    const sites = await siteService.list();
    res.json({ data: sites });
  },

  async getSummary(req, res) {
    const summary = await siteService.getSummary(req.params.id);
    res.json({ data: { siteId: req.params.id, ...summary } });
  },
};
