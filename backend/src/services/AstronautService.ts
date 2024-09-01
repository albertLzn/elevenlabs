import { Knex } from 'knex';
import { Astronaut } from '../entities/Astronaut';

export interface AstronautService {
  getAll(): Promise<Astronaut[]>;
  getById(id: number): Promise<Astronaut | null>;
  create(astronaut: Omit<Astronaut, 'id' | 'originPlanet'> & { originPlanetId: number }): Promise<Astronaut>;
  update(id: number, astronaut: Partial<Omit<Astronaut, 'id' | 'originPlanet'>> & { originPlanetId?: number }): Promise<Astronaut | null>;
  delete(id: number): Promise<boolean>;
}

export class AstronautServiceImpl implements AstronautService {
  constructor(private db: Knex) {}

  async getAll(): Promise<Astronaut[]> {
    const query = `
      SELECT 
      astronauts.*, 
      planets.name AS planet_name, 
      planets.description AS planet_description, 
      planets.isHabitable AS planet_isHabitable,
      images.id AS planet_image_id,
      images.path AS planet_image_path,
      images.name AS planet_image_name
      FROM astronauts
      LEFT JOIN planets ON astronauts.originPlanetId = planets.id
      LEFT JOIN images ON planets.imageId = images.id
    `;
    
    const [rows] = await this.db.raw(query);
    const mappedAstronauts = this.mapToAstronauts(rows);
    return mappedAstronauts;
  }

  async getById(id: number): Promise<Astronaut | null> {
    const query = `
      SELECT 
      astronauts.*, 
      planets.name AS planet_name, 
      planets.description AS planet_description, 
      planets.isHabitable AS planet_isHabitable,
      images.id AS planet_image_id,
      images.path AS planet_image_path,
      images.name AS planet_image_name
      FROM astronauts
      LEFT JOIN planets ON astronauts.originPlanetId = planets.id
      LEFT JOIN images ON planets.imageId = images.id
      WHERE astronauts.id = :id
    `;
    
    const [rows] = await this.db.raw(query, { id });    
    if (rows.length === 0) {
      return null;
    }
    return this.mapToAstronaut(rows[0]);
  }

  async create(astronautData: Omit<Astronaut, 'id' | 'originPlanet'> & { originPlanetId: number }): Promise<Astronaut> {
    const [id] = await this.db('astronauts').insert(astronautData);
    return this.getById(id) as Promise<Astronaut>;
  }

  async update(id: number, astronautData: Partial<Omit<Astronaut, 'id' | 'originPlanet'>> & { originPlanetId?: number }): Promise<Astronaut | null> {
    await this.db('astronauts').where('id', id).update(astronautData);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.db('astronauts').where('id', id).del();
    return deletedCount > 0;
  }

  private mapToAstronauts(data: any[]): Astronaut[] {
    const rows = Array.isArray(data[0]) ? data[0] : data;
    return rows.map((row: any) => this.mapToAstronaut(row));
  }

  private mapToAstronaut(row: any): Astronaut {
    return {
      id: row.id,
      firstname: row.firstname,
      lastname: row.lastname,
      originPlanet: {
        id: row.originPlanetId,
        name: row.planet_name,
        description: row.planet_description,
        isHabitable: row.planet_isHabitable === 1,
        image: {
          id: row.planet_image_id,
          path: row.planet_image_path,
          name: row.planet_image_name
        }
      }
    };
  }
}




