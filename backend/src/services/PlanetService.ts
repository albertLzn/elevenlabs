import { Knex } from 'knex';
import Planet from '../entities/Planet';

export interface PlanetService {
  getAll(filterName?: string): Promise<Planet[]>;
  getById(id: number): Promise<Planet | null>;
  create(planet: Omit<Planet, 'id'>): Promise<Planet>;
  update(id: number, planet: Partial<Omit<Planet, 'id'>>): Promise<Planet | null>;
  delete(id: number): Promise<boolean>;
}

export class PlanetServiceImpl implements PlanetService {
  constructor(private db: Knex) {}

  async getAll(filterName?: string): Promise<Planet[]> {
    let query = this.db('planets')
      .select(
        'planets.*',
        'images.id as image_id',
        'images.name as image_name',
        'images.path as image_path'
      )
      .leftJoin('images', 'planets.imageId', 'images.id');

    if (filterName) {
      query = query.whereRaw('LOWER(planets.name) LIKE ?', [`%${filterName.toLowerCase()}%`]);
    }

    const planets = await query;
    return this.mapToPlanets(planets);
  }


  async getById(id: number): Promise<Planet | null> {
    const query = `
      SELECT 
        planets.*,
        images.id AS image_id,
        images.name AS image_name,
        images.path AS image_path
      FROM planets
      LEFT JOIN images ON planets.imageId = images.id
      WHERE planets.id = :id
    `;
    
    const [rows] = await this.db.raw(query, { id });
    if (rows.length === 0) {
      return null;
    }
    return this.mapToPlanets(rows)[0];
  }

  async create(planetData: Omit<Planet, 'id'>): Promise<Planet> {
    const { image, ...planetInfo } = planetData;
    const [imageId] = await this.db('images').insert(image);
    const [planetId] = await this.db('planets').insert({ ...planetInfo, imageId });
    return this.getById(planetId) as Promise<Planet>;
  }
  
  async update(id: number, planetData: Partial<Omit<Planet, 'id'>>): Promise<Planet | null> {
    const { image, ...planetInfo } = planetData;
    const existingPlanet = await this.getById(id);
    if (!existingPlanet) {
      return null;
    }
    if (image) {
      await this.db('images')
        .where('id', existingPlanet.image.id)
        .update(image);
    }
    await this.db('planets').where('id', id).update(planetInfo);
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

  private mapToPlanets(rows: any[]): Planet[] {
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      isHabitable: row.isHabitable === 1,
      image: {
        id: row.image_id,
        name: row.image_name,
        path: row.image_path
      }
    }));
  }
}