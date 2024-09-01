import express from 'express';
import { PlanetController } from '../controllers/PlanetController';

export const setupPlanetRoutes = (planetController: PlanetController) => {
  const router = express.Router();

  router.get('/', planetController.getAll);
  router.get('/:id', planetController.getById);
  router.post('/', planetController.create);
  router.put('/:id', planetController.update);
  router.delete('/:id', planetController.delete);

  return router;
};