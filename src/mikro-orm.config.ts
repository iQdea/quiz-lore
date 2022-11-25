import { Configuration, Options } from '@mikro-orm/core';
import { config as envConfig } from 'dotenv';

envConfig();

const MkORMConfig: Options | Configuration = {
  debug: true,
  entities: ['./dist/**/*.entity.js', './dist/**/*.embeddable.js'],
  entitiesTs: ['./src/**/*.entity.ts', './src/**/*.embeddable.ts'],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL || '',
  driverOptions: {
    connection: { ssl: true }
  },
  schemaGenerator: {
    disableForeignKeys: false
  }
};

export default MkORMConfig;
