import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 CORS (bien)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://precious-magic-production-9914.up.railway.app'
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔥 ESTO ES LO QUE TE FALTA (CAUSA DE TODOS LOS 404)
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  new Logger('Bootstrap').log(`Server running on ${port}`);
}

bootstrap();