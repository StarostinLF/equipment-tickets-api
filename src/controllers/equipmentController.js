import { equipmentService } from '../services/equipmentService.js';
import { weatherService } from '../services/weatherService.js';

export const equipmentController = {
  async list(req, res) {
    const { items, total, page, limit } = await equipmentService.list(req.validatedQuery);
    res.json({ data: items, meta: { total, page, limit } });
  },

  async getById(req, res) {
    const equipment = await equipmentService.getById(req.params.id);
    res.json({ data: equipment });
  },

  async create(req, res) {
    const equipment = await equipmentService.create(req.body);
    res.status(201).location(`/api/equipment/${equipment.id}`).json({ data: equipment });
  },

  async update(req, res) {
    const equipment = await equipmentService.update(req.params.id, req.body);
    res.json({ data: equipment });
  },

  async remove(req, res) {
    await equipmentService.remove(req.params.id);
    res.status(204).end();
  },

  async getWeather(req, res) {
    const equipment = await equipmentService.getById(req.params.id);
    const forecast = await weatherService.getForecast(equipment.location);
    res.json({ data: { equipmentId: equipment.id, ...forecast } });
  },
};
