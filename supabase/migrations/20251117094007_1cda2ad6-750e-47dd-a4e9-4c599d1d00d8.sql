-- Fix RLS policy to allow collaborative map viewing
-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own locations" ON public.locations;

-- Create new policy allowing all authenticated users to view all locations
CREATE POLICY "Authenticated users can view all locations"
ON public.locations
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Keep existing policies for INSERT, UPDATE, DELETE (owner-only access)
-- These ensure users can only modify their own locations