import { Knex } from 'knex';
import Image from '../entities/Image';


export interface ImageService {
  getAll(): Promise<Image[]>;
  getById(id: number): Promise<Image | null>;
  create(image: Omit<Image, 'id'>): Promise<Image>;
  update(id: number, image: Partial<Image>): Promise<Image | null>;
  delete(id: number): Promise<boolean>;
}

export class ImageServiceImpl implements ImageService {
  constructor(private db: Knex) {}

  async getAll(): Promise<Image[]> {
    return this.db('images').select('*');
  }

  async getById(id: number): Promise<Image | null> {
    return this.db('images').where('id', id).first();
  }

  async create(image: Omit<Image, 'id'>): Promise<Image> {
    const [id] = await this.db('images').insert(image);
    return this.getById(id) as Promise<Image>;
  }

  async update(id: number, image: Partial<Image>): Promise<Image | null> {
    await this.db('images').where('id', id).update(image);
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.db('images').where('id', id).del();
    return deletedCount > 0;
  }
}