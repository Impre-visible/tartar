import { Injectable } from '@nestjs/common';
import { Tartar } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TartarService {

    constructor(private prisma: PrismaService) { }

    async getAll(): Promise<Tartar[]> {
        return await this.prisma.tartar.findMany();
    }
}
