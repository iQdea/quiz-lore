import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from '../database/seeder';
import config from '../../mikro-orm.config';

async function init() {
  return MikroORM.init(config);
}

(async () => {
  try {
    const orm = await init();
    const generator = orm.getSchemaGenerator();

    // Drop schema
    await generator.dropSchema({ wrap: false });

    // Add extensions
    await generator.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', {
      wrap: false
    });
    await generator.execute('CREATE EXTENSION IF NOT EXISTS "postgis"', {
      wrap: false
    });

    // Generate schema
    await generator.createSchema({ wrap: false });

    // Run seeder
    const seeder = orm.getSeeder();
    await seeder.seed(DatabaseSeeder);

    await orm.close(true);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
