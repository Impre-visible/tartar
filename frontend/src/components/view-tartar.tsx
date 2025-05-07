"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Tartar } from "@/types/tartar"
import { Separator } from "@/components/ui/separator"
import { StarIcon, MapPinIcon, DollarSignIcon, UtensilsIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { currencies } from "@/lib/constants/currencies"

export function ViewTartar({
    tartar,
    onOpenChange,
}: {
    tartar: Tartar | null
    onOpenChange: () => void
}) {
    if (!tartar) return null

    return (
        <Sheet open={!!tartar} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto gap-4 pt-4 lg:pt-0">
                <SheetHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-bold">{tartar.restaurant.name}</SheetTitle>
                    </div>
                    <SheetDescription className="flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="mr-1 h-4 w-4" />
                        {tartar.restaurant.address}
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <section className="flex flex-col gap-8 p-4 pt-0">
                    {/* Price Information */}
                    <div className="rounded-lg bg-muted/50 p-4 flex flex-col gap-2">
                        <h3 className="flex items-center gap-1 text-sm font-medium">
                            <DollarSignIcon className="h-4 w-4" />
                            Prix
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Prix Original</p>
                                <p className="text-lg font-semibold">
                                    {tartar.price} {currencies.find((currency) => currency.value === tartar.currency)?.symbol}
                                </p>
                            </div>
                            {tartar.currency !== "usd" && (
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Prix en USD
                                    </p>
                                    <p className="text-lg font-semibold">${tartar.usd_price.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ratings */}
                    <div>
                        <h3 className="mb-3 flex items-center text-sm font-medium">
                            <UtensilsIcon className="mr-2 h-4 w-4" />
                            Notes détaillées
                        </h3>

                        <div className="flex flex-col gap-4">
                            <RatingBar label="Goût" value={tartar.taste_rating} />
                            <RatingBar label="Texture" value={tartar.texture_rating} />
                            <RatingBar label="Présentation" value={tartar.presentation_rating} />
                        </div>

                        <div className="mt-6 rounded-lg bg-primary/10 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Note moyenne
                                </span>
                                <div className="flex gap-2 items-center">
                                    <StarIcon className="mr-1 h-5 w-5 fill-primary text-primary" />
                                    <span className="text-lg font-bold">{tartar.total_rating.toFixed(1)}/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </SheetContent>
        </Sheet >
    )
}

function RatingBar({ label, value }: { label: string; value: number }) {
    // Calculate percentage for the progress bar (assuming ratings are out of 5)
    const percentage = (value / 5) * 100

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <span className="text-sm font-medium">{value.toFixed(1)}/5</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    )
}
