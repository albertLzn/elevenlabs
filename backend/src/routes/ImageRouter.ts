import express from 'express';
import { ImageController } from '../controllers/ImageController';

const router = express.Router();

export const setupImageRoutes = (imageController: ImageController) => {
  router.get('/', imageController.getAll);
  router.get('/:id', imageController.getById);
  router.post('/', imageController.create);
  router.put('/:id', imageController.update);
  router.delete('/:id', imageController.delete);

  return router;
};
