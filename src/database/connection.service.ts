/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { CreateDatabasePool } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = CreateDatabasePool();
    await this.testConnection();
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection established successfully');
    } catch (error: unknown) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return { rows: result.rows };
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error: unknown) {
      console.error('Failed to acquire a database client', error);
      throw error;
    }
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
