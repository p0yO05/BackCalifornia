import { Module } from '@nestjs/common';
import { DictadorlogService } from './dictadorlog.service';
import { DictadorlogController } from './dictadorlog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictadorlog } from './entities/dictadorlog.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JwtStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [DictadorlogController],
  providers: [DictadorlogService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([Dictadorlog, Dictador]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    DictadorlogService,
    JwtModule,
  ],
})
export class DictadorlogModule {}