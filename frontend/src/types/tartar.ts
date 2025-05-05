import { Restaurant } from "./restaurant"

export interface Tartar {
    id: string
    price: number
    currency: string
    usd_price: number
    taste_rating: number
    texture_rating: number
    presentation_rating: number
    total_rating: number
    restaurant: Restaurant
    restaurantId: string
}