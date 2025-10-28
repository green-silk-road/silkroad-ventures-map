import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';

// Fix default marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  type?: string;
}

interface MapComponentProps {
  onLocationClick?: (location: { lng: number; lat: number; name?: string; id?: string }) => void;
}

// Custom component to handle map clicks
function MapClickHandler({ onLocationClick }: { onLocationClick?: (location: { lng: number; lat: number }) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationClick?.({
        lng: e.latlng.lng,
        lat: e.latlng.lat
      });
    },
  });
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationClick }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data: locations, error } = await supabase
        .from('locations')
        .select('*');

      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }

      setLocations(locations || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const createCustomIcon = (type?: string) => {
    const color = type === 'uploaded' ? '#3b82f6' : '#166534';
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="7" fill="white"/>
      </svg>
    `;
    return new L.DivIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  return (
    <div className="relative w-full h-[600px]">
      <MapContainer
        center={[35, 65]}
        zoom={2}
        className="absolute inset-0 rounded-lg shadow-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationClick={onLocationClick} />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(location.type)}
            eventHandlers={{
              click: () => {
                onLocationClick?.({
                  lng: location.longitude,
                  lat: location.latitude,
                  name: location.name,
                  id: location.id
                });
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold mb-1">{location.name}</h3>
                {location.description && (
                  <p className="text-muted-foreground mb-1">{location.description}</p>
                )}
                <p className="text-xs text-muted-foreground">Click to explore this location</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[1000]">
        <h3 className="font-semibold text-sm text-card-foreground">The Green Silk Road</h3>
        <p className="text-xs text-muted-foreground">Click locations to explore</p>
      </div>
    </div>
  );
};

export default MapComponent;