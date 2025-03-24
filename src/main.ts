import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// Cargar las variables de entorno desde .env
dotenv.config();

async function bootstrap() {
  // Validar que la variable SECRET_KEY esté configurada
  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY Not specified!');
  }

  // Crear la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS (permite conexiones desde otros orígenes)
  app.enableCors();

  // Middleware para registrar solicitudes HTTP
  app.use(morgan('tiny'));

  // Validación global de datos entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no especificadas en los DTOs
      forbidNonWhitelisted: true, // Bloquea propiedades no permitidas
    }),
  );

  // Manejo global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración de prefijo global para las rutas
  app.setGlobalPrefix('api'); // Todas las rutas estarán bajo /api

  // Iniciar la aplicación en el puerto definido en las variables de entorno
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
