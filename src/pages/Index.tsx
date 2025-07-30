import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import HeroSection from '@/components/Home/HeroSection';
import MapComponent from '@/components/Map/MapComponent';
import LocationUpload from '@/components/Map/LocationUpload';

const Index = () => {
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);

  const handleLocationClick = (location: { lng: number; lat: number; name?: string; id?: string }) => {
    console.log('Location clicked:', location);
    // TODO: Navigate to location detail page or show popup
  };

  const handleUploadSuccess = () => {
    // Trigger map refresh to show new locations
    setMapRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore the Network</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate through projects, communities, and opportunities across the Green Silk Road. 
              Click on any location to learn more or contribute your own content.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:flex-shrink-0">
              <LocationUpload onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="flex-1">
              <MapComponent 
                onLocationClick={handleLocationClick} 
                refreshTrigger={mapRefreshTrigger}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
