import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';

const MapComponent = ({ location, listings }) => {
    const mapRef = useRef();
    const [geoCode, setGeoCode] = useState([24.860966, 66.990501]); // Default center
    const [markers, setMarkers] = useState([]);

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

    // Determine zoom level based on props
    const getZoomLevel = () => {
        if (listings && listings.length > 0) {
            return 2; // Zoom level when listings are present
        } else {
            return 11; // Default zoom level or when location is present
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (location) {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}&limit=1`);
                    if (response.data && response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        const newGeoCode = [parseFloat(lat), parseFloat(lon)];
                        setGeoCode(newGeoCode);
                        
                        if (mapRef.current) {
                            mapRef.current.setView(newGeoCode, 11);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchData();
    }, [location]);

    useEffect(() => {
        const fetchListingsData = async () => {
            if (listings && listings.length > 0) {
                const newMarkers = [];
                for (const listing of listings) {
                    try {
                        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${listing.address}&limit=1`);
                        if (response.data && response.data.length > 0) {
                            const { lat, lon } = response.data[0];
                            const newMarker = {
                                geoCode: [parseFloat(lat), parseFloat(lon)],
                                popUp: listing.name
                            };
                            newMarkers.push(newMarker);
                        }
                    } catch (error) {
                        console.error(`Error fetching coordinates for ${listing.address}:`, error);
                    }
                }
                setMarkers(newMarkers);

                // Adjust map view to fit all markers
                if (mapRef.current && newMarkers.length > 0) {
                    const bounds = newMarkers.reduce((acc, marker) => {
                        return [
                            ...acc,
                            marker.geoCode
                        ];
                    }, []);
                    mapRef.current.fitBounds(bounds,{ maxZoom: 4 });
                }
            }
        };

        fetchListingsData();
    }, [listings]);

    return (
        <div className='w-full h-full'>
            <MapContainer center={geoCode} zoom={getZoomLevel()} className='w-full h-full' ref={mapRef}>
                <TileLayer
                    url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9lw3SXFhb6I62TLQOh3qkT2m8orxamEsr90FCa0LPnXxfJYCH9FQpXBZ7S64fTJA"
                />
                <Circle center={geoCode} pathOptions={{ color: 'white', fillColor: 'white' }} radius={5000} />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createCustomClusterIcon}
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.geoCode} icon={customIcon}>
                            <Popup>
                                <h1>{marker.popUp}</h1>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
