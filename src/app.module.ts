import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictadorsModule } from './dictadors/dictadors.module';
import { SponsorModule } from './sponsors/sponsors.module';
import { BattleModule } from './battles/battles.module';
import { BlackmarketModule } from './blackmarket/blackmarket.module';
import { DictadorlogModule } from './dictadorlog/dictadorlog.module';
import { BetModule } from './dictador-bets/dictador-bets.module';
import { SpecialEventsModule } from './special-events/special-events.module';
import { EsclavosModule } from './esclavos/esclavos.module';
@Module({
  imports: [
    DictadorsModule,
    SponsorModule,
    BattleModule,
    BlackmarketModule,
    DictadorlogModule,
    BetModule,
    SpecialEventsModule,
    EsclavosModule, // Importamos el EsclavosModule aquí
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}