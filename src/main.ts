// Load environment variables
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import * as net from 'net';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const allowedOrigins = [
    'http://localhost:5173',      // add your frontend origin(s)
    'https://93.127.166.200',      // add server IP if frontends served from same IP
    'https://sabalpara-parivar.vercel.app'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, mobile apps, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('CORS not allowed'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    credentials: true // set to true only if you need cookies/auth
  });
  app.use('/public', express.static(join(process.cwd(), 'public')));
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_app_dev';
  console.log(`[Config] Mongo URI: ${mongoUri}`);
  const basePort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const maxAttempts = 20;
  const freePort = await findFreePort(basePort, maxAttempts);
 
  if (freePort === null) {
    console.error(`No free port found in range ${basePort}..${basePort + maxAttempts}`);
    process.exit(1);
  }
  if (freePort !== basePort) {
    console.warn(`Base port ${basePort} busy; selected free port ${freePort}`);
  }
  await app.listen(freePort, '0.0.0.0');
  console.log(`API listening on http://localhost:${freePort}/api`);
}
bootstrap();

function findFreePort(start: number, attempts: number): Promise<number | null> {
  return new Promise((resolve) => {
    let port = start;
    const tryNext = (remaining: number) => {
      if (remaining <= 0) return resolve(null);
      const server = net.createServer();
      server.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          port++;
          server.close(() => tryNext(remaining - 1));
        } else {
          resolve(null);
        }
      });
      server.once('listening', () => {
        server.close(() => resolve(port));
      });
      server.listen(port, '0.0.0.0');
    };
    tryNext(attempts);
  });
}

 