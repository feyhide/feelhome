import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import mapboxgl from '@mapbox/mapbox-sdk/services/geocoding';

const MapComponent = ({ location, listings }) => {
    const mapRef = useRef();
    const boundsRef = useRef(new window.L.LatLngBounds());
    const [radius, setRadius] = useState(0);
    const [geoCode, setGeoCode] = useState([24.860966, 66.990501]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);

    const customIcon = new Icon({
        iconUrl: "/markericon.png",
        iconSize: [38, 38]
    });

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="font-sub font-bold rounded-full flex items-center justify-center w-8 h-8">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33]
        });
    };

    const getZoomLevel = () => {
        if (listings && listings.length > 0) {
            return 2;
        } else {
            return 11;
        }
    };

    const fetchLocationData = async (location) => {
        const mapboxClient = mapboxgl({ accessToken: 'pk.eyJ1IjoiZmV5aGlkZSIsImEiOiJjbHl1YzcwcnMxMWF3Mmpwd2pyeW1lY3dvIn0.XyayFSAAjpmd9-yzrOhBgg' });
        try {
            const response = await mapboxClient.forwardGeocode({
                query: location,
                limit: 1
            }).send();
            
            if (response && response.body && response.body.features.length > 0) {
                const { center } = response.body.features[0];
                return { lat: center[1], lon: center[0] };
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (location) {
                const locationData = await fetchLocationData(location);
                if (locationData) {
                    setGeoCode([locationData.lat, locationData.lon]);
                    setRadius(3000);
                    if (mapRef.current) {
                        mapRef.current.setView([locationData.lat, locationData.lon], 11);
                    }
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [location]);

    useEffect(() => {
        const fetchListingsData = async () => {
            setLoading(true);
            if (listings && listings.length > 0) {
                setRadius(0);
                const newMarkers = [];
                for (const listing of listings) {
                    const locationData = await fetchLocationData(listing.address);
                    if (locationData) {
                        newMarkers.push({
                            geoCode: [locationData.lat, locationData.lon],
                            popUp: listing.name
                        });
                        boundsRef.current.extend([locationData.lat, locationData.lon]);
                    }
                }
                setMarkers(newMarkers);
                if (mapRef.current) {
                    mapRef.current.fitBounds(boundsRef.current.pad(0.5));
                }
            }
            setLoading(false);
        };

        fetchListingsData();
    }, [listings]);

    return (
        !loading ? (
            <div className='w-full h-full'>
                <MapContainer center={geoCode} zoom={getZoomLevel()} className='w-full h-full' ref={mapRef}>
                    <TileLayer
                        url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9lw3SXFhb6I62TLQOh3qkT2m8orxamEsr90FCa0LPnXxfJYCH9FQpXBZ7S64fTJA"
                    />
                    <Circle center={geoCode} pathOptions={{ color: 'white', fillColor: 'white' }} radius={10000} />
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createCustomClusterIcon}
                        className=""
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
        ) : (
            <div className='w-full h-full relative flex items-center justify-center'>
                <img className='w-full h-full object-cover' src='/maploading.jpeg' alt="Loading"/>
                <div className='flex items-center justify-center absolute top-0 w-full h-full bg-white bg-opacity-70'>
                    <h1 className='font-sub text-3xl tracking-[-2px] font-bold'>Loading Map...</h1>
                </div>
            </div>
        )
    );
};

export default MapComponent;
