import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import Header from '@/components/Layout/Header';
import ProjectEntryForm from '@/components/Map/ProjectEntryForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Contribute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect unauthenticated users to auth page
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Redirect if not authenticated
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmitSuccess = () => {
    // Could add additional success handling here if needed
    console.log('Project added successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contribute to the Network</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help expand the Green Silk Road network by adding new sustainable projects, locations, and opportunities.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome, {user.email}</CardTitle>
                <CardDescription>
                  You're signed in and ready to contribute to the network. Add your project below.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <ProjectEntryForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contribute;