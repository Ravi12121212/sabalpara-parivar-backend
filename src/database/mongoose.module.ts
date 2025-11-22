import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/auth_app_dev',
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('[Mongo] connected'));
          connection.on('error', (err: unknown) => console.error('[Mongo] error', err));
          connection.on('disconnected', () => console.warn('[Mongo] disconnected'));
          return connection;
        },
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongooseDatabaseModule {}
