import { setupPlanetRoutes } from '../../routes/PlanetRouter';
import { PlanetController } from '../../controllers/PlanetController';
import { PlanetService } from '../../services/PlanetService';

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('Planet Routes', () => {
  let mockPlanetController: jest.Mocked<PlanetController>;
  let router: any;

  beforeEach(() => {
    const mockPlanetService = {} as jest.Mocked<PlanetService>;
    
    mockPlanetController = {
      planetService: mockPlanetService,
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlanetController>;

    router = setupPlanetRoutes(mockPlanetController);
  });

  it('should set up GET all route', () => {
    expect(router.get).toHaveBeenCalledWith('/', mockPlanetController.getAll);
  });

  it('should get by id', () => {
    expect(router.get).toHaveBeenCalledWith('/:id', mockPlanetController.getById);
  });

  it('should POST route', () => {
    expect(router.post).toHaveBeenCalledWith('/', mockPlanetController.create);
  });

  it('should PUT route', () => {
    expect(router.put).toHaveBeenCalledWith('/:id', mockPlanetController.update);
  });

  it('should DELETE', () => {
    expect(router.delete).toHaveBeenCalledWith('/:id', mockPlanetController.delete);
  });
});