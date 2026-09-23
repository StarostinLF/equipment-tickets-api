import { requestService } from '../services/requestService.js';

export const requestController = {
  async list(req, res) {
    const { items, total, page, limit } = await requestService.list(req.validatedQuery);
    res.json({ data: items, meta: { total, page, limit } });
  },

  async listByEquipment(req, res) {
    const { items, total, page, limit } = await requestService.listByEquipment(
      req.params.id,
      req.validatedQuery,
    );
    res.json({ data: items, meta: { total, page, limit } });
  },

  async getById(req, res) {
    const request = await requestService.getById(req.params.id);
    res.json({ data: request });
  },

  async create(req, res) {
    const request = await requestService.create(req.body);
    res.status(201).location(`/api/requests/${request.id}`).json({ data: request });
  },

  async update(req, res) {
    const request = await requestService.update(req.params.id, req.body);
    res.json({ data: request });
  },

  async updateStatus(req, res) {
    const { status, changedBy, comment } = req.body;
    const request = await requestService.updateStatus(req.params.id, status, { changedBy, comment });
    res.json({ data: request });
  },

  async getHistory(req, res) {
    const history = await requestService.getHistory(req.params.id);
    res.json({ data: history });
  },

  async remove(req, res) {
    await requestService.remove(req.params.id);
    res.status(204).end();
  },
};
