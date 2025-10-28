import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';

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

const MapComponent: React.FC<MapComponentProps> = ({ onLocationClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    initializeMap();
    loadLocations();

    return () => {
      // Cleanup markers and map
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Create the Leaflet map
    mapRef.current = L.map(mapContainer.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([35, 65], 2); // [lat, lng]

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 22,
    }).addTo(mapRef.current);

    // Handle map clicks
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      onLocationClick?.({ lng: e.latlng.lng, lat: e.latlng.lat });
    });
  };

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      setLocations(data || []);

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers
      (data || []).forEach((location: Location) => {
        const marker = L.marker([location.latitude, location.longitude], {
          icon: createCustomIcon(location.type),
        })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div style="font-size: 14px;">
              <h3 style="margin: 0; font-weight: 700;">${location.name}</h3>
              ${location.description ? `<p style="margin: 4px 0; color: #6b7280;">${location.description}</p>` : ''}
              <p style="margin: 4px 0 0 0; color: #6b7280;">Click to explore this location</p>
            </div>
          `);

        marker.on('click', () => {
          onLocationClick?.({
            lng: location.longitude,
            lat: location.latitude,
            name: location.name,
            id: location.id,
          });
        });

        markersRef.current.push(marker);
      });
    } catch (err) {
      console.error('Error loading locations:', err);
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
    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[1000]">
        <h3 className="font-semibold text-sm text-card-foreground">The Green Silk Road</h3>
        <p className="text-xs text-muted-foreground">Click locations to explore</p>
      </div>
    </div>
  );
};

export default MapComponent;
