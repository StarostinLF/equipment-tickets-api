import { assigneeService } from '../services/assigneeService.js';

export const assigneeController = {
  async assignTeam(req, res) {
    const request = await assigneeService.assignTeam(req.params.id, req.body.assignees);
    res.json({ data: request });
  },

  async remove(req, res) {
    await assigneeService.removeAssignee(req.params.id, req.params.userId);
    res.status(204).end();
  },
};
