import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './prisma/prisma.service';

import { RestaurantController } from './modules/restaurant/controller/restaurant.controller';
import { RestaurantService } from './modules/restaurant/service/restaurant.service';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

import { TartarService } from './modules/tartar/service/tartar.service';
import { TartarController } from './modules/tartar/controller/tartar.controller';
import { TartarModule } from './modules/tartar/tartar.module';

import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }), HttpModule, RestaurantModule, TartarModule, OtpModule],
  controllers: [AppController, RestaurantController, TartarController],
  providers: [AppService, PrismaService, RestaurantService, TartarService],
})
export class AppModule { }
