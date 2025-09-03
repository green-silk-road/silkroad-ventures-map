import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LocationUploadProps {
  onUploadSuccess?: () => void;
}

const LocationUpload: React.FC<LocationUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['name', 'latitude', 'longitude'];
      const missingFields = requiredFields.filter(field => 
        !headers.some(h => h.includes(field) || h.includes(field.substring(0, 3)))
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required columns: ${missingFields.join(', ')}. Expected columns containing: name, latitude, longitude`);
      }

      // Find column indices
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const latIndex = headers.findIndex(h => h.includes('lat'));
      const lngIndex = headers.findIndex(h => h.includes('lng') || h.includes('lon'));
      const descIndex = headers.findIndex(h => h.includes('desc') || h.includes('description'));

      const locations = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length < Math.max(nameIndex, latIndex, lngIndex) + 1) continue;

        const lat = parseFloat(values[latIndex]);
        const lng = parseFloat(values[lngIndex]);
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Skipping row ${i + 1}: Invalid coordinates`);
          continue;
        }

        locations.push({
          name: values[nameIndex] || `Location ${i}`,
          latitude: lat,
          longitude: lng,
          description: descIndex >= 0 ? values[descIndex] : null,
          type: 'uploaded'
        });
      }

      if (locations.length === 0) {
        throw new Error('No valid locations found in CSV');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to upload locations');
      }

      // Add user_id to locations
      const locationData = locations.map(location => ({
        ...location,
        user_id: user.id
      }));

      // Insert locations into database
      const { error } = await supabase
        .from('locations')
        .insert(locationData);

      if (error) throw error;

      setUploadStatus('success');
      toast({
        title: "Upload successful",
        description: `${locations.length} locations added to the map`,
      });

      onUploadSuccess?.();
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Locations
        </CardTitle>
        <CardDescription>
          Upload a CSV file with geocoded location data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            CSV should include: name, latitude, longitude
            <br />
            Optional: description
          </p>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>

        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            Processing CSV file...
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            Locations uploaded successfully
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            Upload failed - check file format
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Expected CSV format:</p>
          <code className="text-xs bg-muted p-2 rounded block">
            name,latitude,longitude,description<br />
            "Location 1",40.7128,-74.0060,"Description here"
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationUpload;