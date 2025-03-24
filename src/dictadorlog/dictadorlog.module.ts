import { Module } from '@nestjs/common';
import { DictadorlogService } from './dictadorlog.service';
import { DictadorlogController } from './dictadorlog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictadorlog } from './entities/dictadorlog.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JwtStrategy';

@Module({
  controllers: [DictadorlogController],
  providers: [DictadorlogService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([Dictadorlog]), // Configuración de TypeORM 
    PassportModule.register({ defaultStrategy: 'jwt' }), // Usamos 'jwt' 
    JwtModule.registerAsync({
      useFactory: () => {
        // Validamos que la variable de entorno esté disponible
        if (!process.env.SECRET_KEY) {
          throw new Error('SECRET_KEY environment variable is not set!');
        }
        return {
          secret: process.env.SECRET_KEY, // Clave secreta para JWT en el env template
          signOptions: {
            expiresIn: '2h', // Tiempo de expiración del token al iniciar sesion
          },
        };
      },
    }),
  ],
  exports: [
    TypeOrmModule, // Exportamos TypeORM para otros módulos
    JwtStrategy, // Exportamos la estrategia JWT si otros módulos necesitan protección
    PassportModule, // Exportamos PassportModule para autenticación
    DictadorlogService, // Exportamos el servicio para ser usado en otros lugares si es necesario
  ],
})
export class DictadorlogModule {}