import React, { useEffect, useState } from 'react';
import { Map, Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Tartar } from '@/types/tartar';
import { useTheme } from './theme-provider';
import CustomMarker from './marker';

interface TartarMapProps {
    tartars: Tartar[];
    setSelectedTartar: (tartar: Tartar | null) => void;
}

const TartarMap: React.FC<TartarMapProps> = ({ tartars = [], setSelectedTartar }) => {
    const { theme } = useTheme();
    const [mapStyle, setMapStyle] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/positron');

    const [viewport, _setViewport] = useState({
        latitude: 46.8566,
        longitude: 2.3522,
        zoom: 5.5,
        width: '100%',
        height: '100%',
    });

    const handleThemeChange = () => {
        let systemTheme = theme;

        if (theme === 'system') {
            systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (systemTheme === 'dark') {
            setMapStyle('https://tiles.openfreemap.org/styles/dark');
        } else {
            setMapStyle('https://tiles.openfreemap.org/styles/positron');
        }
    }

    useEffect(() => {
        handleThemeChange();
    }, [theme]);

    return (
        <Map
            style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
            initialViewState={viewport}
            mapStyle={mapStyle}
        >
            {tartars.map((tartar) => (
                <Marker
                    key={tartar.id}
                    latitude={tartar.restaurant.latitude}
                    longitude={tartar.restaurant.longitude}
                >

                    <CustomMarker
                        text={tartar.restaurant.name}
                        description={"Cliquez pour voir les détails"}
                        onClick={() => {
                            setSelectedTartar(tartar);
                            _setViewport({
                                ...viewport,
                                latitude: tartar.restaurant.latitude,
                                longitude: tartar.restaurant.longitude,
                                zoom: 10,
                            });
                        }}
                    />
                </Marker>
            ))}
        </Map>
    );
};

export default TartarMap;
