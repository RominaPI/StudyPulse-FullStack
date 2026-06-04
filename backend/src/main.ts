import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('ANTES DE CREATE');

    const app = await NestFactory.create(AppModule);

    console.log('DESPUES DE CREATE');

    const port = 3000;

    console.log('ANTES DE LISTEN');

    await app.listen(port);

    console.log('DESPUES DE LISTEN');

    const logger = new Logger('Bootstrap');
    logger.log(`Servidor en http://localhost:${port}`);
  } catch (error) {
    console.error('ERROR EN BOOTSTRAP:', error);
  }
}

bootstrap();