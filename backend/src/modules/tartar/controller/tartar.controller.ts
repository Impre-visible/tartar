import { Controller, Get } from '@nestjs/common';
import { TartarService } from '../service/tartar.service';

@Controller('tartar')
export class TartarController {
    constructor(private tartarService: TartarService) { }

    @Get()
    tartar() {
        return this.tartarService.getAll();
    }
}
