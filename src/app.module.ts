import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictadorsModule } from './dictators/dictadors.module';
import { SponsorModule } from './sponsors/sponsors.module';
import { BattleModule } from './battles/battles.module';
import { BlackmarketModule } from './blackmarket/blackmarket.module';
import { DictadorlogModule } from './dictadorlog/dictadorlog.module';
import { BetModule } from './dictador-bets/dictador-bets.module';
import { EsclavosModule } from './esclavos/esclavos.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your own secret key
      signOptions: { expiresIn: '1h' },
    }),
    DictadorsModule,
    SponsorModule,
    BattleModule,
    BlackmarketModule,
    DictadorlogModule,
    BetModule,
    EsclavosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule],
})
export class AppModule {}