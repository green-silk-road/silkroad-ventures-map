-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all locations" ON public.locations;

-- Create a restrictive SELECT policy so users can only view their own locations
CREATE POLICY "Users can view their own locations"
ON public.locations
FOR SELECT
USING (auth.uid() = user_id);