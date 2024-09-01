import { Knex } from 'knex';
import { Astronaut } from '../entities/Astronaut';

export interface AstronautService {
  getAll(): Promise<Astronaut[]>;
  getById(id: number): Promise<Astronaut | null>;
  create(astronaut: Omit<Astronaut, 'id' | 'originPlanet'>): Promise<Astronaut>;
  update(id: number, astronaut: Partial<Omit<Astronaut, 'id' | 'originPlanet'>>): Promise<Astronaut | null>;
  delete(id: number): Promise<boolean>;
}

export class AstronautServiceImpl implements AstronautService {
  constructor(private db: Knex) {}

  async getAll(): Promise<Astronaut[]> {
    return this.db('astronauts')
      .select('astronauts.*', 'planets.name as planetName', 'planets.description', 'planets.isHabitable', 'images.path', 'images.name as imageName')
      .join('planets', 'astronauts.originPlanetId', 'planets.id')
      .join('images', 'planets.imageId', 'images.id')
      .then(rows => rows.map(this.mapToAstronaut));
  }

  async getById(id: number): Promise<Astronaut | null> {
    const astronaut = await this.db('astronauts')
      .select('astronauts.*', 'planets.name as planetName', 'planets.description', 'planets.isHabitable', 'images.path', 'images.name as imageName')
      .join('planets', 'astronauts.originPlanetId', 'planets.id')
      .join('images', 'planets.imageId', 'images.id')
      .where('astronauts.id', id)
      .first();
    
    return astronaut ? this.mapToAstronaut(astronaut) : null;
  }

  async create(astronaut: Omit<Astronaut, 'id' | 'originPlanet'>): Promise<Astronaut> {
    const [id] = await this.db('astronauts').insert(astronaut);
    return this.getById(id) as Promise<Astronaut>;
  }

  async update(id: number, astronaut: Partial<Omit<Astronaut, 'id' | 'originPlanet'>>): Promise<Astronaut | null> {
    await this.db('astronauts').where('id', id).update(astronaut);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.db('astronauts').where('id', id).del();
    return deletedCount > 0;
  }

  private mapToAstronaut(data: any): Astronaut {
    return {
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      originPlanetId: data.originPlanetId,
      originPlanet: {
        name: data.planetName,
        id: data.originPlanetId,
        isHabitable: data.isHabitable,
        description: data.description,
        image: {
          id: data.imageId,
          path: data.path,
          name: data.imageName,
        },
      },
    };
  }
}