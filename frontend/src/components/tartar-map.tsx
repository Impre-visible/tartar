import React from 'react';
import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Tartar } from '@/types/tartar';

interface TartarMapProps {
    tartars: Tartar[];
}

const TartarMap: React.FC<TartarMapProps> = ({ tartars = [] }) => {
    const [viewport, setViewport] = React.useState({
        latitude: 46.8566,
        longitude: 2.3522,
        zoom: 5.5,
        width: '100%',
        height: '100%',
    });

    //light style is positron
    //dark style is dark

    return (
        <Map
            style={{ width: '100%', height: '100%' }}
            initialViewState={viewport}
            mapStyle='https://tiles.openfreemap.org/styles/positron'
        >
            {tartars.map((tartar) => (
                <Marker
                    key={tartar.id}
                    latitude={tartar.restaurant.latitude}
                    longitude={tartar.restaurant.longitude}
                >
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            cursor: 'pointer',
                        }}
                    />
                </Marker>
            ))}
        </Map>
    );
};

export default TartarMap;
