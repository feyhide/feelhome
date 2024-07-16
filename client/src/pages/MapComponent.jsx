import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';

const MapComponent = ({ location }) => {
    const mapRef = useRef();
    const [geoCode, setGeoCode] = useState([24.860966, 66.990501]); // Default center
    const [markers, setMarkers] = useState({
        geoCode: [24.860966, 66.990501],
        popUp: "Here"
    });

    const customIcon = new Icon({
        iconUrl: "/markericon.png",
        iconSize: [38, 38]
    });

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div className="">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33]
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}&limit=1`);
                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    const newGeoCode = [parseFloat(lat), parseFloat(lon)];
                    setGeoCode(newGeoCode);
                    setMarkers({
                        geoCode: newGeoCode,
                        popUp: location
                    });
                    
                    if (mapRef.current) {
                        mapRef.current.setView(newGeoCode, 11);
                    }
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchData();
    }, [location]);

    return (
        <div className='w-full h-full'>
            <MapContainer center={geoCode} zoom={11} className='w-full h-full' ref={mapRef}>
                <TileLayer
                    url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9lw3SXFhb6I62TLQOh3qkT2m8orxamEsr90FCa0LPnXxfJYCH9FQpXBZ7S64fTJA"
                />
                <Circle center={geoCode} pathOptions={{ color: 'white', fillColor: 'white' }} radius={5000} />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createCustomClusterIcon}
                >
                    <Marker position={markers.geoCode} icon={customIcon}>
                        <Popup>
                            <h1>{markers.popUp}</h1>
                        </Popup>
                    </Marker>
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
