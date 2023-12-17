import { QueryOptions } from 'mongoose-query-parser';


export interface ICrudService<T> {
  create(item: T): Promise<T>;

  get(teams: string[], query: QueryOptions): Promise<T[]>;

  getByID(id: string): Promise<T | null>;

  /*  update(id: string, item: T): Promise<T>;*/

  delete(id: string): Promise<void | null>;
}

