import { QueryOptions } from 'mongoose-query-parser';


export interface ICrudService<T> {
  insertNewRecord(item: T): Promise<T>;

  get(teams: string[], query: QueryOptions): Promise<T[]>;

  getByID(id: string): Promise<T | null>;

  deleteDocumentById(id: string): Promise<{ recordID: string; message: string }>;
}

