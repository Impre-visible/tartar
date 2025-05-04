import { PlusIcon } from "lucide-react";
import { useGeolocated } from "react-geolocated";
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider"

import { DefaultSearchResult, SearchInput } from "./ui/search-input";
import { ResponsiveDrawerDialog, ResponsiveDrawerDialogContent, ResponsiveDrawerDialogTrigger } from "./ui/responsive-dialog";
import { GooglePlaceResult } from "@/types";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

import { PriceInput } from "./ui/price-input";

const tartarSchema = z.object({
    restaurant: z.string().min(1, "Veuillez sélectionner un restaurant"),
    currency: z.string().min(1, "Veuillez sélectionner une devise"),
    price: z.number().min(0, "Le prix doit être positif"),
    texture: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    taste: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    presentation: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    totalScore: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
});

function AddTartar() {
    const [results, setResults] = useState<DefaultSearchResult[]>([]);

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 5000,
        },
        userDecisionTimeout: 5000,
        watchPosition: false,
        onSuccess: async (position) => {
            console.log("Position: ", position);
            const data = await fetch(`${import.meta.env.VITE_API_URL}/api/restaurant/search?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
            const json = await data.json() as GooglePlaceResult[];
            setResults(json.map((place) => ({
                id: place.place_id,
                text: `${place.name} (${municipality(place.formatted_address)})`, // (${place.vicinity})
            })))
        },
        onError: (error) => {
            console.error("Geolocation error: ", error);
        },
    });

    const form = useForm({
        resolver: zodResolver(tartarSchema),
        defaultValues: {
            restaurant: "",
            currency: "eur",
            price: 2.5,
            texture: 2.5,
            taste: 2.5,
            presentation: 2.5,
            totalScore: 2.5,
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // reset the state when the dialog is closed
            setResults([]);
            form.reset();
            return;
        }
        // If it's open, get the lat/long of the client, to get the 10 closest restaurants/bars
        if (!isGeolocationAvailable) {
            console.error("Geolocation is not available");
            return;
        }
        if (!isGeolocationEnabled) {
            console.error("Geolocation is not enabled");
            return;
        }
        if (coords && coords.latitude && coords.longitude && open) {
            console.log("Latitude: ", coords.latitude); // 37.7749
            console.log("Longitude: ", coords.longitude); // -122.4194
        } else {
            console.error("Coordinates are not available");
        }
    };

    const municipality = (formatted_address: string) => {
        const parts = formatted_address.split(", ");
        if (parts.length > 1) {
            return parts[parts.length - 2];
        }
        return formatted_address;
    };

    const onSubmit = (data: z.infer<typeof tartarSchema>) => {
        const totalScore = (data.texture + data.taste + data.presentation) / 3;
        console.log("Tartar data is valid:", data);
        console.log("Total Score:", totalScore);
    };

    const handleAverageNote = () => {
        const texture = form.getValues("texture");
        const taste = form.getValues("taste");
        const presentation = form.getValues("presentation");
        const totalScore = (texture + taste + presentation) / 3;
        form.setValue("totalScore", totalScore);
    }

    return (
        <ResponsiveDrawerDialog onOpenChange={handleOpenChange} title="Ajouter un tartare">
            <ResponsiveDrawerDialogTrigger>
                <section className="fixed bottom-6 right-6">
                    <Button variant="default" className="w-12 h-12 rounded-full">
                        <PlusIcon className="!h-6 !w-6" />
                    </Button>
                </section>
            </ResponsiveDrawerDialogTrigger>
            <ResponsiveDrawerDialogContent>
                <section className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold">Ajouter un tartare</h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Créez votre propre tartare en ajoutant vos ingrédients préférés.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-6">
                            <FormField
                                control={form.control}
                                name="restaurant"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rechercher un restaurant</FormLabel>
                                        <FormControl>
                                            <SearchInput
                                                {...field}
                                                className="mt-2"
                                                placeholder="Nom du restaurant..."
                                                onSearch={async (query) => {
                                                    if (!query) {
                                                        setResults([]);
                                                        return;
                                                    }
                                                    const data = await fetch(`${import.meta.env.VITE_API_URL}/api/restaurant/search?query=${query}`);
                                                    const json = await data.json();
                                                    const places = Array.isArray(json) ? json as GooglePlaceResult[] : [];
                                                    setResults(places.map((place) => ({
                                                        id: place.place_id,
                                                        text: `${place.name} (${municipality(place.formatted_address)})`, // (${place.vicinity})
                                                    })))
                                                }}
                                                results={results}
                                                onItemSelect={(item) => {
                                                    field.onChange(JSON.stringify(item));
                                                    setResults([]);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prix</FormLabel>
                                        <FormControl>
                                            <PriceInput
                                                onAmountChange={(value) => {
                                                    console.log("Value: ", value);
                                                    field.onChange(value);
                                                }}
                                                onCurrencyChange={(value) => {
                                                    form.setValue("currency", value);
                                                }}
                                                initialAmount={field.value}
                                                initialCurrency="eur"
                                                searchCurrencyEmptyText="Aucune devise trouvée"
                                                searchCurrencyText="Rechercher une devise..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="texture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour la texture</FormLabel>
                                        <FormControl >
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    defaultValue={[0]}
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="taste"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour le goût</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    defaultValue={[0]}
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="presentation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour la présentation</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    defaultValue={[0]}
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note totale</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    defaultValue={[0]}
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    disabled
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full md:w-auto md:float-right">Soumettre</Button>
                        </form>
                    </Form>
                </section>
            </ResponsiveDrawerDialogContent>
        </ResponsiveDrawerDialog>
    );
}

export default AddTartar;
