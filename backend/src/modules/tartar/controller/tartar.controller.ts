import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TartarService } from '../service/tartar.service';
import { CreateTartarDto } from '../dto/createTartarDto';

@Controller('tartar')
export class TartarController {
    constructor(private tartarService: TartarService) { }

    @Get()
    tartar() {
        return this.tartarService.getAll();
    }

    @Post()
    async createTartar(@Body() data: CreateTartarDto) {
        return await this.tartarService.createOne(data);
    }

    @Put()
    async updateTartar(@Body() data: CreateTartarDto & { id: string }) {
        return await this.tartarService.updateOne(data);
    }

    @Delete()
    async deleteTartar(@Body() data: { id: string }) {
        return await this.tartarService.deleteOne(data.id);
    }
}
