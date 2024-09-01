import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService';

export class ImageController {
  constructor(private imageService: ImageService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const images = await this.imageService.getAll();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const image = await this.imageService.getById(Number(id));
      if (image) {
        res.status(200).json(image);
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, path } = req.body;
    try {
      const newImage = await this.imageService.create({ name, path });
      res.status(201).json(newImage);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, path } = req.body;
    try {
      const updatedImage = await this.imageService.update(Number(id), { name, path });
      if (updatedImage) {
        res.status(200).json(updatedImage);
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deleted = await this.imageService.delete(Number(id));
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}