import { AstronautServiceImpl } from '../../services/AstronautService';
import { Knex } from 'knex';

jest.mock('knex');

describe('AstronautService', () => {
  let astronautService: AstronautServiceImpl;
  let mockDb: jest.Mocked<Knex>;

  beforeEach(() => {
    const chainedMethods = {
      insert: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
    };

    mockDb = jest.fn(() => chainedMethods) as unknown as jest.Mocked<Knex>;
    mockDb.raw = jest.fn();

    astronautService = new AstronautServiceImpl(mockDb);
  });

  describe('getAll', () => {
    it('should return all astronauts', async () => {
      const mockRows = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          originPlanetId: 1,
          planet_name: 'Earth',
          planet_description: 'Blue planet',
          planet_isHabitable: 1,
          planet_image_id: 1,
          planet_image_path: '/path/to/image',
          planet_image_name: 'Earth Image',
        },
      ];

      mockDb.raw.mockResolvedValue([mockRows]);

      const result = await astronautService.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('firstname', 'John');
      expect(result[0].originPlanet).toHaveProperty('name', 'Earth');
    });
  });

  describe('getById', () => {
    it('should return an astronaut by id', async () => {
      const mockRow = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        originPlanetId: 1,
        planet_name: 'Earth',
        planet_description: 'Blue planet',
        planet_isHabitable: 1,
        planet_image_id: 1,
        planet_image_path: '/path/to/image',
        planet_image_name: 'Earth Image',
      };

      mockDb.raw.mockResolvedValue([[mockRow]]);

      const result = await astronautService.getById(1);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('firstname', 'John');
      expect(result?.originPlanet).toHaveProperty('name', 'Earth');
    });

    it('should return null if astronaut not found', async () => {
      mockDb.raw.mockResolvedValue([[]]);

      const result = await astronautService.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new astronaut', async () => {
      const newAstronaut = {
        firstname: 'Jane',
        lastname: 'Doe',
        originPlanetId: 2,
      };

      (mockDb('astronauts') as any).insert.mockResolvedValue([2]);
      jest.spyOn(astronautService, 'getById').mockResolvedValue({
        id: 2,
        ...newAstronaut,
        originPlanet: { id: 2, name: 'Mars', description: 'Red planet', isHabitable: false, image: { id: 2, path: '/path', name: 'Mars Image' } },
      } as any);

      const result = await astronautService.create(newAstronaut);

      expect(mockDb).toHaveBeenCalledWith('astronauts');
      expect((mockDb('astronauts') as any).insert).toHaveBeenCalledWith(newAstronaut);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('firstname', 'Jane');
    });
  });

  describe('update', () => {
    it('should update an existing astronaut', async () => {
      const updatedAstronaut = {
        firstname: 'Jane Updated',
      };

      (mockDb('astronauts') as any).where().update.mockResolvedValue(1);
      jest.spyOn(astronautService, 'getById').mockResolvedValue({
        id: 1,
        firstname: 'Jane Updated',
        lastname: 'Doe',
        originPlanet: { id: 1, name: 'Earth', description: 'Blue planet', isHabitable: true, image: { id: 1, path: '/path', name: 'Earth Image' } },
      } as any);

      const result = await astronautService.update(1, updatedAstronaut);

      expect(mockDb).toHaveBeenCalledWith('astronauts');
      expect((mockDb('astronauts') as any).where).toHaveBeenCalledWith('id', 1);
      expect((mockDb('astronauts') as any).where().update).toHaveBeenCalledWith(updatedAstronaut);
      expect(result).toHaveProperty('firstname', 'Jane Updated');
    });
  });

  describe('delete', () => {
    it('should delete an astronaut', async () => {
      (mockDb('astronauts') as any).where().del.mockResolvedValue(1);

      const result = await astronautService.delete(1);

      expect(mockDb).toHaveBeenCalledWith('astronauts');
      expect((mockDb('astronauts') as any).where).toHaveBeenCalledWith('id', 1);
      expect(result).toBe(true);
    });

    it('should return false if astronaut not found', async () => {
      (mockDb('astronauts') as any).where().del.mockResolvedValue(0);

      const result = await astronautService.delete(999);

      expect(result).toBe(false);
    });
  });
});