import { Request, Response } from 'express';
import { AstronautService } from '../services/AstronautService';


export class AstronautController {
  constructor(private astronautService: AstronautService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const astronauts = await this.astronautService.getAll();
      res.status(200).json(astronauts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const astronaut = await this.astronautService.getById(Number(id));
      if (astronaut) {
        res.status(200).json(astronaut);
      } else {
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, originPlanetId } = req.body;
    try {
      const newAstronaut = await this.astronautService.create({ firstname, lastname, originPlanetId });
      res.status(201).json(newAstronaut);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { firstname, lastname, originPlanetId } = req.body;
    try {
      const updatedAstronaut = await this.astronautService.update(Number(id), { firstname, lastname, originPlanetId });
      if (updatedAstronaut) {
        res.status(200).json(updatedAstronaut);
      } else {
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deleted = await this.astronautService.delete(Number(id));
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}


