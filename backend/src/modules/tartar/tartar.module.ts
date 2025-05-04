import { Module } from '@nestjs/common';
import { TartarController } from './controller/tartar.controller';
import { TartarService } from './service/tartar.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [TartarController],
    providers: [TartarService, PrismaService]
})
export class TartarModule { }
