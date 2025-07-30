import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

interface MapComponentProps {
  onLocationClick?: (location: { lng: number; lat: number; name?: string }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        projection: 'globe' as any,
        zoom: 2,
        center: [65, 35], // Center on Central Asia (Silk Road region)
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and styling
      map.current.on('style.load', () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: 'rgb(220, 190, 170)',
          'high-color': 'rgb(180, 150, 130)',
          'horizon-blend': 0.1,
        });

        // Add sample markers for Silk Road locations
        const silkRoadLocations = [
          { name: "Istanbul", lng: 28.9784, lat: 41.0082 },
          { name: "Tehran", lng: 51.3890, lat: 35.6892 },
          { name: "Samarkand", lng: 66.9597, lat: 39.6270 },
          { name: "Kashgar", lng: 75.9877, lat: 39.4704 },
          { name: "Xi'an", lng: 108.9401, lat: 34.3416 },
        ];

        silkRoadLocations.forEach(location => {
          const marker = new mapboxgl.Marker({
            color: 'hsl(147, 47%, 25%)', // Primary green
            scale: 0.8
          })
            .setLngLat([location.lng, location.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3 style="color: hsl(40, 15%, 15%); margin: 0; font-weight: bold;">${location.name}</h3>
                          <p style="color: hsl(40, 10%, 45%); margin: 4px 0 0 0; font-size: 14px;">Click to explore this location</p>`)
            )
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            onLocationClick?.(location);
          });
        });
      });

      // Handle map clicks for adding new locations
      map.current.on('click', (e) => {
        onLocationClick?.({
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        });
      });

      setIsTokenValid(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsTokenValid(false);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      initializeMap(storedToken);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenValid) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-4">Mapbox Token Required</h3>
          <p className="text-muted-foreground mb-6">
            Enter your Mapbox public token to display the interactive map. 
            Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} disabled={!mapboxToken}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <h3 className="font-semibold text-sm text-card-foreground">The Green Silk Road</h3>
        <p className="text-xs text-muted-foreground">Click locations to explore</p>
      </div>
    </div>
  );
};

export default MapComponent;