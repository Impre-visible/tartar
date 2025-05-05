import { Injectable } from '@nestjs/common';
import { Restaurant } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchRestaurantsDto } from '../dto/searchRestaurantsDto';

@Injectable()
export class RestaurantService {
    private API_KEY = process.env.GOOGLE_PLACES_API_KEY
    private RADIUS = process.env.GOOGLE_PLACES_RADIUS || 10000


    constructor(private prisma: PrismaService) { }

    async getAll(): Promise<Restaurant[]> {
        return await this.prisma.restaurant.findMany()
    }

    async search(query: SearchRestaurantsDto) {
        if (!this.API_KEY) {
            return { error: "API key is not configured", statusCode: 500 }
        }

        let url: string | null = null


        const { latitude, longitude, query: search } = query

        if (latitude && longitude) {
            url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${this.RADIUS}&type=restaurant&key=${this.API_KEY}&location=${latitude},${longitude}`
        }

        if (search) {
            url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&type=restaurant&key=${this.API_KEY}`
        }

        if (!url) {
            return { error: "No query provided", statusCode: 400 }
        }


        const response = await fetch(url)

        const data = await response.json() as GooglePlaceResponse

        return data.results
    }
}
