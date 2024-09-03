import { PlanetServiceImpl } from '../../services/PlanetService';
import { Knex } from 'knex';
import Planet from '../../entities/Planet';
import Image from '../../entities/Image';

jest.mock('knex');

describe('PlanetService', () => {
  let planetService: PlanetServiceImpl;
  let mockDb: jest.Mocked<Knex>;

  beforeEach(() => {
    const chainedMethods = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      whereRaw: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
    };

    mockDb = jest.fn(() => chainedMethods) as unknown as jest.Mocked<Knex>;
    mockDb.raw = jest.fn();

    planetService = new PlanetServiceImpl(mockDb);
  });

  describe('create', () => {
    it('should create a new planet', async () => {
      const newPlanet = {
        name: 'testPlanet1',
        description: 'test for planet 1',
        isHabitable: true,
        image: { name: 'new.jpg', path: '/path/new', id: 1}
      };

      (mockDb('images') as any).insert.mockResolvedValue([1]);
      (mockDb('planets') as any).insert.mockResolvedValue([2]);
      jest.spyOn(planetService, 'getById').mockResolvedValue({ 
        id: 2, 
        ...newPlanet, 
        image: { id: 1, name: 'new.jpg', path: '/path/new' }
      } as Planet);

      const result = await planetService.create(newPlanet);

      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('name', 'testPlanet1');
      expect(result.image).toHaveProperty('id', 1);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect(mockDb).toHaveBeenCalledWith('planets');
    });
  });

  describe('update', () => {
    it('should update an existing planet', async () => {
      const updatedPlanet = {
        name: 'Updated Planet',
        image: { name: 'updated.jpg', path: '/path/updated', id: 1 },
      };

      jest.spyOn(planetService, 'getById').mockResolvedValueOnce({ 
        id: 1, 
        name: 'Old Planet', 
        description: 'An old planet', 
        isHabitable: false, 
        image: { id: 1, name: 'old.jpg', path: '/path/old' } 
      } as Planet);
      
      (mockDb('images') as any).where().update.mockResolvedValue(1);
      (mockDb('planets') as any).where().update.mockResolvedValue(1);
      
      jest.spyOn(planetService, 'getById').mockResolvedValueOnce({ 
        id: 1, 
        name: 'Updated Planet', 
        description: 'An old planet', 
        isHabitable: false, 
        image: { id: 1, name: 'updated.jpg', path: '/path/updated' } 
      } as Planet);

      const result = await planetService.update(1, updatedPlanet);

      expect(result).toHaveProperty('name', 'Updated Planet');
      expect(result?.image).toHaveProperty('name', 'updated.jpg');
      expect(mockDb).toHaveBeenCalledWith('images');
      expect(mockDb).toHaveBeenCalledWith('planets');
    });
  });


  describe('getAll', () => {
    it('should return all planets', async () => {
      const mockPlanets = [
        { id: 1, name: 'Earth', description: 'Blue planet', isHabitable: 1, image_id: 1, image_name: 'Earth.jpg', image_path: '/path/earth' },
        { id: 2, name: 'Mars', description: 'Red planet', isHabitable: 0, image_id: 2, image_name: 'Mars.jpg', image_path: '/path/mars' },
      ];

      (mockDb('planets') as any).select().leftJoin.mockResolvedValue(mockPlanets);

      const result = await planetService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name', 'Earth');
      expect(result[1]).toHaveProperty('name', 'Mars');
      expect(mockDb).toHaveBeenCalledWith('planets');
    });

    it('should filter planets by name', async () => {
      const mockPlanets = [
        { id: 1, name: 'Earth', description: 'Blue planet', isHabitable: 1, image_id: 1, image_name: 'Earth.jpg', image_path: '/path/earth' },
      ];

      (mockDb('planets') as any).select().leftJoin.whereRaw.mockResolvedValue(mockPlanets);

      const result = await planetService.getAll('Earth');

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('name', 'Earth');
      expect((mockDb('planets') as any).whereRaw).toHaveBeenCalledWith('LOWER(planets.name) LIKE ?', ['%earth%']);
    });
  });

  describe('getById', () => {
    it('should return a planet by id', async () => {
      const mockPlanet = [{ id: 1, name: 'Earth', description: 'Blue planet', isHabitable: 1, image_id: 1, image_name: 'Earth.jpg', image_path: '/path/earth' }];

      mockDb.raw.mockResolvedValue([mockPlanet]);

      const result = await planetService.getById(1);

      expect(result).toHaveProperty('name', 'Earth');
      expect(mockDb.raw).toHaveBeenCalled();
    });

    it('should return null if planet not found', async () => {
      mockDb.raw.mockResolvedValue([[]]);

      const result = await planetService.getById(999);

      expect(result).toBeNull();
    });
  });

  



  describe('delete', () => {
    it('should delete a planet', async () => {
      (mockDb('planets') as any).where().del.mockResolvedValue(1);

      const result = await planetService.delete(1);

      expect(result).toBe(true);
      expect(mockDb).toHaveBeenCalledWith('planets');
      expect((mockDb('planets') as any).where).toHaveBeenCalledWith('id', 1);
    });

    it('should return false if planet not found', async () => {
      (mockDb('planets') as any).where().del.mockResolvedValue(0);

      const result = await planetService.delete(999);

      expect(result).toBe(false);
    });
  });
});