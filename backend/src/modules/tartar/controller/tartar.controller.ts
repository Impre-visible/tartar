import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
