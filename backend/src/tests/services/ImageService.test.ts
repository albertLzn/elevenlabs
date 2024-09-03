import { ImageServiceImpl } from '../../services/ImageService';
import { Knex } from 'knex';

jest.mock('knex');

describe('ImageService', () => {
  let imageService: ImageServiceImpl;
  let mockDb: jest.Mocked<Knex>;

  beforeEach(() => {
    const chainedMethods = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
    };

    mockDb = jest.fn(() => chainedMethods) as unknown as jest.Mocked<Knex>;
    mockDb.raw = jest.fn();

    imageService = new ImageServiceImpl(mockDb);
  });

  describe('getAll', () => {
    it('should return all images', async () => {
      const mockImages = [
        { id: 1, name: 'Image 1', path: '/path/1' },
        { id: 2, name: 'Image 2', path: '/path/2' },
      ];

      (mockDb('images') as any).select.mockResolvedValue(mockImages);

      const result = await imageService.getAll();

      expect(result).toEqual(mockImages);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect((mockDb('images') as any).select).toHaveBeenCalledWith('*');
    });
  });

  describe('getById', () => {
    it('should return an image by id', async () => {
      const mockImage = { id: 1, name: 'Image 1', path: '/path/1' };

      (mockDb('images') as any).where().first.mockResolvedValue(mockImage);

      const result = await imageService.getById(1);

      expect(result).toEqual(mockImage);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect((mockDb('images') as any).where).toHaveBeenCalledWith('id', 1);
    });

    it('should return null if image not found', async () => {
      (mockDb('images') as any).where().first.mockResolvedValue(null);

      const result = await imageService.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new image', async () => {
      const newImage = { name: 'New Image', path: '/path/new' };
      const createdImage = { id: 3, ...newImage };

      (mockDb('images') as any).insert.mockResolvedValue([3]);
      jest.spyOn(imageService, 'getById').mockResolvedValue(createdImage);

      const result = await imageService.create(newImage);

      expect(result).toEqual(createdImage);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect((mockDb('images') as any).insert).toHaveBeenCalledWith(newImage);
    });
  });

  describe('update', () => {
    it('should update an existing image', async () => {
      const updatedImage = { name: 'Updated Image' };
      const fullUpdatedImage = { id: 1, name: 'Updated Image', path: '/path/1' };

      (mockDb('images') as any).where().update.mockResolvedValue(1);
      jest.spyOn(imageService, 'getById').mockResolvedValue(fullUpdatedImage);

      const result = await imageService.update(1, updatedImage);

      expect(result).toEqual(fullUpdatedImage);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect((mockDb('images') as any).where).toHaveBeenCalledWith('id', 1);
      expect((mockDb('images') as any).where().update).toHaveBeenCalledWith(updatedImage);
    });
  });

  describe('delete', () => {
    it('should delete an image', async () => {
      (mockDb('images') as any).where().del.mockResolvedValue(1);

      const result = await imageService.delete(1);

      expect(result).toBe(true);
      expect(mockDb).toHaveBeenCalledWith('images');
      expect((mockDb('images') as any).where).toHaveBeenCalledWith('id', 1);
    });

    it('should return false if image not found', async () => {
      (mockDb('images') as any).where().del.mockResolvedValue(0);

      const result = await imageService.delete(999);

      expect(result).toBe(false);
    });
  });
});