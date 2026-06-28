import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { runSeed } from './database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run seed script
  const dataSource = app.get(DataSource);
  await runSeed(dataSource);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  });

  app.use(cookieParser());

  const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });
  app.use((req: Request, res: Response, next: NextFunction) => {
    const skipPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
    ];
    if (skipPaths.includes(req.path) || req.path.startsWith('/api/shared/')) {
      return next();
    }
    csrfProtection(req, res, next);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if ((req as any).csrfToken) {
      res.cookie('XSRF-TOKEN', (req as any).csrfToken(), { sameSite: 'strict' });
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🌏 Traveloop API running on http://localhost:${port}/api`);
}
bootstrap();
