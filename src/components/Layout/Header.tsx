import React from 'react';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { MapPin, Compass, ShoppingBag, GraduationCap, PenTool, LogIn, UserPlus } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">The Green Silk Road</h1>
              <p className="text-xs text-muted-foreground">Sustainable journeys, regenerative trade</p>
            </div>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent">
                      <Compass className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Travel</h4>
                        <p className="text-sm text-muted-foreground">Discover sustainable journeys and overland routes</p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Trade</h4>
                        <p className="text-sm text-muted-foreground">Buy and sell sustainable goods</p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Training</h4>
                        <p className="text-sm text-muted-foreground">Learn sustainable living practices</p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium hover:text-primary">
                  Projects
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium hover:text-primary">
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Join TGSR
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;