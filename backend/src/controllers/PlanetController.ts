import { Request, Response } from 'express';
import { PlanetService } from '../services/PlanetService';

export class PlanetController {
  constructor(private planetService: PlanetService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const planets = await this.planetService.getAll();
      res.status(200).json(planets);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const planet = await this.planetService.getById(Number(id));
      if (planet) {
        res.status(200).json(planet);
      } else {
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, isHabitable, description, image } = req.body;
    try {
      const newPlanet = await this.planetService.create({ name, isHabitable, description, image });
      res.status(201).json(newPlanet);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, isHabitable, description, image } = req.body;
    try {
      const updatedPlanet = await this.planetService.update(Number(id), { name, isHabitable, description, image });
      if (updatedPlanet) {
        res.status(200).json(updatedPlanet);
      } else {
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deleted = await this.planetService.delete(Number(id));
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}