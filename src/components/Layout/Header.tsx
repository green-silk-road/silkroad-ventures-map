import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Compass, ShoppingBag, GraduationCap, Menu, LogIn, UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-bold text-foreground">The Green Silk Road</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Sustainable journeys, regenerative trade</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-popover z-50">
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
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium hover:text-primary cursor-pointer">
                  Projects
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="px-4 py-2 text-sm font-medium hover:text-primary cursor-pointer"
                    onClick={() => navigate('/contribute')}
                  >
                    Contribute
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden xl:block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join TGSR
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card z-[100]">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase">Explore</h3>
                    <div className="space-y-3 pl-2">
                      <button className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-accent">
                        <Compass className="w-4 h-4 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">Travel</h4>
                          <p className="text-xs text-muted-foreground">Sustainable journeys</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-accent">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">Trade</h4>
                          <p className="text-xs text-muted-foreground">Sustainable goods</p>
                        </div>
                      </button>
                      <button className="flex items-center space-x-3 w-full text-left p-2 rounded-md hover:bg-accent">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">Training</h4>
                          <p className="text-xs text-muted-foreground">Learn practices</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    Projects
                  </Button>

                  {user && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => {
                        navigate('/contribute');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Contribute
                    </Button>
                  )}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{user.email}</p>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join TGSR
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;