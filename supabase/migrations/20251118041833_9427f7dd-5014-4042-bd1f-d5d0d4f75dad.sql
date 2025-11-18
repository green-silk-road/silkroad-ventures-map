-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can view all locations" ON public.locations;

-- Create new policy allowing everyone to view locations on the public map
CREATE POLICY "Allow public read access to locations"
ON public.locations
FOR SELECT
USING (true);