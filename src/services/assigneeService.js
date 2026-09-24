import { sequelize } from '../config/database.js';
import { requestRepository } from '../repositories/requestRepository.js';
import { requestAssigneeRepository } from '../repositories/requestAssigneeRepository.js';
import { technicianRepository } from '../repositories/technicianRepository.js';
import { requestService } from './requestService.js';
import { NotFoundError, ValidationError } from '../errors/index.js';

export const assigneeService = {
  async assignTeam(requestId, assignees) {
    const leadCount = assignees.filter((assignee) => assignee.role === 'lead').length;
    if (leadCount !== 1) {
      throw new ValidationError('В бригаде должен быть ровно один специалист с ролью lead');
    }

    const technicianIds = [...new Set(assignees.map((assignee) => assignee.technicianId))];

    await sequelize.transaction(async (transaction) => {
      const request = await requestRepository.lockById(requestId, transaction);
      if (!request) {
        throw new NotFoundError('Заявка не найдена');
      }

      const found = await technicianRepository.findAllByIds(technicianIds, transaction);
      if (found.length !== technicianIds.length) {
        throw new NotFoundError('Один или несколько специалистов не найдены');
      }

      await requestAssigneeRepository.replaceTeam(requestId, assignees, transaction);
    });

    return requestService.getById(requestId);
  },

  async removeAssignee(requestId, technicianId) {
    await requestService.getById(requestId);

    const removed = await requestAssigneeRepository.removeOne(requestId, technicianId);
    if (!removed) {
      throw new NotFoundError('Специалист не назначен на эту заявку');
    }
  },
};
