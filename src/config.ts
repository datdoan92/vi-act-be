import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import type { DataSourceOptions } from 'typeorm';

export interface Configuration {
  nodeEnv: string;
  appName: string;
  typeorm: DataSourceOptions;
}

export const configFactory = (): Configuration => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: 'viAct API',
  typeorm: {
    type: 'mysql',
    url: process.env.DB_URI || 'mysql://root:root@localhost:3306/viactdb',
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    timezone: 'Z',
    logging: true,
    // synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  },
});

export default configFactory;
