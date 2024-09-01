import express from 'express';
import { AstronautController } from '../controllers/AstronautController';

export const setupAstronautRoutes = (astronautController: AstronautController) => {
  const router = express.Router();

  router.get('/', astronautController.getAll);
  router.get('/:id', astronautController.getById);
  router.post('/', astronautController.create);
  router.put('/:id', astronautController.update);
  router.delete('/:id', astronautController.delete);

  return router;
};