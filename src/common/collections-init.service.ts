import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CollectionsInitService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    // Ensure collections exist by creating indexes
    const models = this.connection.models;
    for (const name of Object.keys(models)) {
      try {
        await models[name].createCollection();
        await models[name].syncIndexes();
        // eslint-disable-next-line no-console
        console.log(`[Mongo] ensured collection & indexes for ${name}`);
      } catch (e: any) {
        if (e.codeName !== 'NamespaceExists') {
          console.warn(`[Mongo] collection init warning for ${name}:`, e.message);
        }
      }
    }
  }
}
