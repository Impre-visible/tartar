import { Tartar } from "@/types/tartar";
import { MapPin, Star } from 'lucide-react';
import { currencies } from "@/lib/constants/currencies";

export function TartarRow({ tartar }: { tartar: Tartar }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 space-y-4">
                <div className="flex flex-col justify-between items-between">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="text-xl font-semibold tracking-tight">{tartar.restaurant.name}</h3>
                        <div className="flex items-center bg-primary/10 px-2.5 py-1 rounded-full">
                            <span className="font-normal md:font-medium text-xs md:text-sm text-primary whitespace-nowrap">
                                {tartar.price} {currencies.find((c) => c.value === tartar.currency)?.symbol}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{tartar.restaurant.address}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    <RatingItem label="Goût" rating={tartar.taste_rating.toFixed(2)} />
                    <RatingItem label="Texture" rating={tartar.texture_rating.toFixed(2)} />
                    <RatingItem label="Présentation" rating={tartar.presentation_rating.toFixed(2)} />
                    <RatingItem label="Total" rating={tartar.total_rating.toFixed(2)} />
                </div>
            </div>
        </div>
    );
}

function RatingItem({ label, rating }: { label: string; rating: string }) {
    return (
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground mb-1">{label}</span>
            <div className="flex items-center">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-0.5" />
                <span className="font-medium text-sm">{rating}</span>
            </div>
        </div>
    );
}
