import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  refreshTrigger?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationClick, refreshTrigger }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const loadLocations = async () => {
    try {
      const { data: locations, error } = await supabase
        .from('locations')
        .select('*');

      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }

      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add markers for each location
      locations?.forEach((location: Location) => {
        const marker = new mapboxgl.Marker({
          color: location.type === 'uploaded' ? 'hsl(220, 70%, 50%)' : 'hsl(147, 47%, 25%)',
          scale: 0.8
        })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <h3 style="color: hsl(40, 15%, 15%); margin: 0; font-weight: bold;">${location.name}</h3>
                ${location.description ? `<p style="color: hsl(40, 10%, 45%); margin: 4px 0; font-size: 14px;">${location.description}</p>` : ''}
                <p style="color: hsl(40, 10%, 45%); margin: 4px 0 0 0; font-size: 14px;">Click to explore this location</p>
              `)
          )
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          onLocationClick?.({
            lng: location.longitude,
            lat: location.latitude,
            name: location.name,
            id: location.id
          });
        });

        markers.current.push(marker);
      });
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
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

      // Load locations when map is ready
      map.current.on('style.load', () => {
        loadLocations();
      });

      // Handle map clicks for adding new locations
      map.current.on('click', (e) => {
        onLocationClick?.({
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (refreshTrigger && map.current) {
      loadLocations();
    }
  }, [refreshTrigger]);

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