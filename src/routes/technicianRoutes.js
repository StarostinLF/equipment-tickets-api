import { Router } from 'express';
import { technicianController } from '../controllers/technicianController.js';

export const technicianRouter = Router();

technicianRouter.get('/technicians', technicianController.list);
