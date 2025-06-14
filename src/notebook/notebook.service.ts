/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/connection.service';
import { CreateNotebookDto } from './dtos/create-notebook.dtos';
import { UpdateNotebookDto } from './dtos/update-notebook.dtos';
import { Notebook } from './interfaces/notebook.interfaces';

interface QueryResult<T> {
  rows: T[];
}

@Injectable()
export class NotebookService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateNotebookDto): Promise<Notebook> {
    const existing: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM notes WHERE title = $1',
      [data.title],
    );
    if (existing.rows.length > 0) {
      throw new ConflictException(
        `Note with title ${data.title} already exists`,
      );
    }

    const result: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM sp_create_note($1, $2)',
      [data.title, data.content],
    );
    return result.rows[0];
  }

  async findAll(): Promise<Notebook[]> {
    const result: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM sp_get_all_notes()',
    );
    return result.rows;
  }

  async findOne(id: number): Promise<Notebook> {
    const result: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM sp_get_notes_by_id($1)',
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return result.rows[0];
  }

  async findByTitle(title: string): Promise<Notebook> {
    const result: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM sp_get_notes_by_title($1)',
      [title],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with title ${title} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, data: UpdateNotebookDto): Promise<Notebook> {
    const existing: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM notes WHERE id = $1',
      [id],
    );
    if (existing.rows.length === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    // Use fallback to current values if not provided
    const note = existing.rows[0];
    const title = data.title ?? note.title;
    const content = data.content ?? note.content;

    if (title && title !== note.title) {
      const duplicate: QueryResult<Notebook> = await this.databaseService.query(
        'SELECT * FROM notes WHERE title = $1',
        [title],
      );
      if (duplicate.rows.length > 0) {
        throw new ConflictException(
          'Another note with the same title already exists',
        );
      }
    }

    const result: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM sp_update_note($1, $2, $3)',
      [id, title, content],
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<{ message: string }> {
    const existing: QueryResult<Notebook> = await this.databaseService.query(
      'SELECT * FROM notes WHERE id = $1',
      [id],
    );
    if (existing.rows.length === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    const result: QueryResult<{ message: string }> =
      await this.databaseService.query('SELECT * FROM delete_note($1)', [id]);

    return {
      message: result.rows[0]?.message || `Note with id ${id} deleted.`,
    };
  }
}
