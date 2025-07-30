import React from 'react';
import Header from '@/components/Layout/Header';
import HeroSection from '@/components/Home/HeroSection';
import MapComponent from '@/components/Map/MapComponent';

const Index = () => {
  const handleLocationClick = (location: { lng: number; lat: number; name?: string }) => {
    console.log('Location clicked:', location);
    // TODO: Navigate to location detail page or show popup
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
          <MapComponent onLocationClick={handleLocationClick} />
        </div>
      </section>
    </div>
  );
};

export default Index;
