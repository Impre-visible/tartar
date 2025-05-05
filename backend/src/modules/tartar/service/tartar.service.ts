import { Injectable } from '@nestjs/common';
import { Tartar } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTartarDto } from '../dto/createTartarDto';
import { ExchangeRateResponse } from '../types/ExchangeRateResponse';

@Injectable()
export class TartarService {

    constructor(private prisma: PrismaService) { }

    async getAll(): Promise<Tartar[]> {
        return await this.prisma.tartar.findMany();
    }

    async createOne(data: CreateTartarDto): Promise<Tartar> {
        const { restaurant, currency, price, texture, taste, presentation, totalScore, createdAt } = data;

        if (!restaurant || !currency || price === undefined || texture === undefined ||
            taste === undefined || presentation === undefined || totalScore === undefined || !createdAt) {
            console.log("Missing required fields");
            console.log(data);
            throw new Error("Missing required fields");
        }

        let restaurantJson: GooglePlaceResult | null = null; // {"business_status":"OPERATIONAL","formatted_address":"Chem. des Routes, 26000 Valence, France","geometry":{"location":{"lat":44.94154349999999,"lng":4.9524675},"viewport":{"northeast":{"lat":44.94295402989272,"lng":4.954337779892722},"southwest":{"lat":44.94025437010727,"lng":4.951638120107278}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png","icon_background_color":"#FF9E67","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet","name":"Auberge Restaurant - Le Remotis","opening_hours":{"open_now":false},"photos":[{"height":3024,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/100791904230960354903\">A Google User</a>"],"photo_reference":"AeeoHcLCF1Xs2W8v__mBY7VNuEijXSpphUpstrMQzSQeuOa0Hmntz8eKJlXOGnZGdTPEyxjJE-9NDCyoenqJ0rPLbad8mXCF-70osNO-KuMQu5LqPRgwn9gTHz_9Kdulir8CgGcHTfkgX_vF6RQdCyLoq38KpfwWvG052phRUkFNZ387hhUOI6BY1NJRh2g89MYaAIEj6MudVAuheHJnmb8SDC3o6P0u9ksBZZlpXff1RIbPuPZZ1ME_bLFQ0vclwX-2qukumcUlh4V86ViByHby3kp9YicwDpJsZAfibax62OBTHRiRgHc","width":4032}],"place_id":"ChIJp4Bfc-VW9UcRxv6Dc_8dAJc","plus_code":{"compound_code":"WXR2+JX Valence","global_code":"8FP6WXR2+JX"},"price_level":2,"rating":4.5,"reference":"ChIJp4Bfc-VW9UcRxv6Dc_8dAJc","types":["restaurant","food","point_of_interest","establishment"],"user_ratings_total":429}

        try {
            restaurantJson = JSON.parse(restaurant);
        } catch (e) {
            throw new Error("Invalid restaurant JSON");
        }

        if (!restaurantJson) {
            throw new Error("Invalid restaurant JSON");
        }

        let restaurantDB = await this.prisma.restaurant.findUnique({
            where: {
                placeId: restaurantJson.place_id
            }
        })

        if (!restaurantDB) {
            restaurantDB = await this.prisma.restaurant.create({
                data: {
                    placeId: restaurantJson.place_id,
                    name: restaurantJson.name,
                    address: restaurantJson.formatted_address,
                    latitude: restaurantJson.geometry.location.lat,
                    longitude: restaurantJson.geometry.location.lng,
                }
            })
        }

        let usdPrice = price;
        //todo: convert price to usd based on currency
        let url = `https://api.exchangerate-api.com/v4/latest/${currency}`

        const response = await fetch(url)
        const currencyJSON = await response.json() as ExchangeRateResponse

        if (!currencyJSON) {
            throw new Error("Invalid currency");
        }
        if (currencyJSON.rates.USD) {
            usdPrice = price / currencyJSON.rates.USD
        }

        const tartar = await this.prisma.tartar.create({
            data: {
                restaurantId: restaurantDB.id,
                currency,
                price,
                usd_price: usdPrice,
                texture_rating: texture,
                taste_rating: taste,
                presentation_rating: presentation,
                total_rating: totalScore,

            }
        })

        return tartar;
    }
}
