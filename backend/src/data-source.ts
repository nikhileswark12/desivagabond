import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const getDataSourceOptions = (): DataSourceOptions => {
  const isPostgres = process.env.DB_TYPE === 'postgres';

  if (isPostgres) {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'traveloop',
      entities: ['src/**/*.entity{.ts,.js}', 'dist/**/*.entity{.js,.ts}'],
      migrations: ['src/migrations/*{.ts,.js}'],
      synchronize: false,
    };
  }

  const dbPath = process.env.DB_PATH || './data/traveloop.db';
  const dir = path.dirname(path.resolve(dbPath));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return {
    type: 'better-sqlite3',
    database: dbPath,
    entities: ['src/**/*.entity{.ts,.js}', 'dist/**/*.entity{.js,.ts}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
  };
};

export const dataSourceOptions: DataSourceOptions = getDataSourceOptions();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
