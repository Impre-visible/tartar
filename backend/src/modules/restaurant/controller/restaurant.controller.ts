import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RestaurantService } from '../service/restaurant.service';
import { SearchRestaurantsDto } from '../dto/searchRestaurantsDto';

@Controller('restaurant')
export class RestaurantController {
    constructor(private restaurantService: RestaurantService) { }

    @Get()
    getAll() {
        return this.restaurantService.getAll();
    }

    @Get('search')
    search(@Query() query: SearchRestaurantsDto) {
        return this.restaurantService.search(query);
    }
}
