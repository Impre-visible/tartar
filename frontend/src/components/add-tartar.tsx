import { PlusIcon } from "lucide-react";

import { useGeolocated } from "react-geolocated";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { SearchInput } from "./ui/search-input";

import { ResponsiveDrawerDialog, ResponsiveDrawerDialogContent, ResponsiveDrawerDialogTrigger } from "./ui/responsive-dialog";
import { GooglePlaceResult } from "@/types";

function AddTartar() {

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 5000,
        },
        userDecisionTimeout: 5000,
        watchPosition: false,
        onSuccess: (position) => {
            console.log("Position: ", position);
        },
        onError: (error) => {
            console.error("Geolocation error: ", error);
        },
    });

    const handleOpenChange = (open: boolean) => {
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
                    <div className="w-full max-w-sm mt-6">
                        <Label
                            htmlFor="restaurant-search"
                        >
                            Rechercher un restaurant
                        </Label>
                        <SearchInput
                            className="mt-2"
                            placeholder="Nom du restaurant..."
                            onSearch={async (query) => {
                                console.log("Searching for restaurant: ", query);
                                const data = await fetch(`${import.meta.env.VITE_API_URL}/api/restaurant/search?query=${query}`);
                                const json = await data.json() as GooglePlaceResult[];
                                return json.map((place) => ({
                                    id: place.place_id,
                                    text: `${place.name} (${municipality(place.formatted_address)})`, // (${place.vicinity})
                                }));
                            }}
                        />
                    </div>
                </section>
            </ResponsiveDrawerDialogContent>
        </ResponsiveDrawerDialog>
    );
}
export default AddTartar;