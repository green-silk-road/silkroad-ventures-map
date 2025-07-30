import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, Leaf } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            The Green Silk Road
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Connecting sustainable communities across ancient trade routes. 
            Discover, contribute, and participate in regenerative travel, trade, and training.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Explore the Map
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Join Community
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactive Mapping</h3>
              <p className="text-muted-foreground text-center">
                Explore projects, communities, and opportunities across the Silk Road regions
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-center">
                Share experiences, create content, and build connections with like-minded travelers
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sustainability Focus</h3>
              <p className="text-muted-foreground text-center">
                Every journey, trade, and training promotes regenerative and sustainable practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;