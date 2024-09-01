import { Knex } from 'knex';
import Planet from '../entities/Planet';

export interface PlanetService {
  getAll(): Promise<Planet[]>;
  getById(id: number): Promise<Planet | null>;
  create(planet: Omit<Planet, 'id'>): Promise<Planet>;
  update(id: number, planet: Partial<Omit<Planet, 'id'>>): Promise<Planet | null>;
  delete(id: number): Promise<boolean>;
}

export class PlanetServiceImpl implements PlanetService {
  constructor(private db: Knex) {}

  async getAll(): Promise<Planet[]> {
    return this.db('planets')
      .select('planets.*', 'images.path as imagePath', 'images.name as imageName')
      .join('images', 'planets.imageId', 'images.id')
      .then(rows => rows.map(this.mapToPlanet));
  }

  async getById(id: number): Promise<Planet | null> {
    const planet = await this.db('planets')
      .select('planets.*', 'images.path as imagePath', 'images.name as imageName')
      .join('images', 'planets.imageId', 'images.id')
      .where('planets.id', id)
      .first();
    
    return planet ? this.mapToPlanet(planet) : null;
  }

  async create(planet: Omit<Planet, 'id'>): Promise<Planet> {
    const { image, ...planetData } = planet;
    const [imageId] = await this.db('images').insert(image);
    const [id] = await this.db('planets').insert({ ...planetData, imageId });
    return this.getById(id) as Promise<Planet>;
  }

  async update(id: number, planetData: Partial<Omit<Planet, 'id'>>): Promise<Planet | null> {
    const { image, ...restPlanetData } = planetData;
    
    if (image) {
      const planet = await this.getById(id);
      if (planet) {
        await this.db('images').where('id', planet.image.id).update(image);
      }
    }

    await this.db('planets').where('id', id).update(restPlanetData);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.db('planets').where('id', id).del();
    return deletedCount > 0;
  }

  private mapToPlanet(data: any): Planet {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      isHabitable: data.isHabitable,
      image: {
        id: data.imageId,
        name: data.imageName,
        path: data.imagePath,
      },
    };
  }
}