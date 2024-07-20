import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';

const MapComponent = ({ location, listings }) => {
    const mapRef = useRef();
    const [radius,setradius] = useState(0)
    const [geoCode, setGeoCode] = useState([24.860966, 66.990501]);
    const [markers, setMarkers] = useState([]);
    const [loading,setloading] = useState(null)

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

    const getZoomLevel = () => {
        if (listings && listings.length > 0) {
            return 2;
        } else {
            return 11;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setloading(true)
            try {
                if (location) {
                    setradius(3000)
                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}&limit=1`);
                    if (response.data && response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        const newGeoCode = [parseFloat(lat), parseFloat(lon)];
                        setGeoCode(newGeoCode);
                        
                        if (mapRef.current) {
                            mapRef.current.setView(newGeoCode, 11);
                        }
                    }
                    setloading(false)
                }
            } catch (error) {
                setloading(false)
                console.error('Error fetching location:', error);
            }
        };

        setloading(false)
        fetchData();
    }, [location]);

    useEffect(() => {
        
        const fetchListingsData = async () => {
            setloading(true)
            if (listings && listings.length > 1) {

                setradius(0)
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

                if (mapRef.current && newMarkers.length > 0) {
                    const bounds = newMarkers.reduce((acc, marker) => {
                        return acc.extend(marker.geoCode);
                    }, new window.L.LatLngBounds());
    
                    mapRef.current.fitBounds(bounds.pad(10.5));
                }
                setloading(false)
            }
        };

        setloading(false)
        fetchListingsData();
    }, [listings]);

    return (
        !loading ? (<div className='w-full h-full'>
            <MapContainer center={geoCode} zoom={getZoomLevel()} className='w-full h-full' ref={mapRef}>
                <TileLayer
                    url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9lw3SXFhb6I62TLQOh3qkT2m8orxamEsr90FCa0LPnXxfJYCH9FQpXBZ7S64fTJA"
                />
                <Circle center={geoCode} pathOptions={{ color: 'white', fillColor: 'white' }} radius={10000} />
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
        </div>):(
            <div className='w-full h-full relative flex items-center justify-center'>
                <img className='w-full h-full object-cover' src='/maploading.jpeg'/>
                <div className='flex items-center justify-center absolute top-0 w-full h-full bg-white bg-opacity-70'>
                    <h1 className='font-sub text-3xl tracking-[-2px] font-bold'>Loading Map...</h1>
                </div>
            </div>
        )
    );
};

export default MapComponent;
