import { Module } from '@nestjs/common';
import { RestaurantController } from './controller/restaurant.controller';
import { RestaurantService } from './service/restaurant.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [RestaurantController],
    providers: [RestaurantService, PrismaService]
})
export class RestaurantModule { }
