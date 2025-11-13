import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

interface ProjectEntryFormProps {
  onSubmitSuccess?: () => void;
}

const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional(),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  type: z.string().trim().max(50, "Type must be less than 50 characters").optional(),
});

const ProjectEntryForm: React.FC<ProjectEntryFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    type: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = projectSchema.parse({
        name: formData.name,
        description: formData.description || undefined,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        type: formData.type || undefined,
      });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to add a project');
      }

      // Insert location into database
      const { error } = await supabase
        .from('locations')
        .insert({
          name: validatedData.name,
          description: validatedData.description || null,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          type: validatedData.type || 'location',
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Project added successfully",
        description: `${validatedData.name} has been added to the map`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        type: '',
      });

      onSubmitSuccess?.();
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation error",
          description: "Please check the form for errors",
          variant: "destructive"
        });
      } else {
        console.error('Submit error:', error);
        toast({
          title: "Error adding project",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Add New Project
        </CardTitle>
        <CardDescription>
          Enter the details of your sustainable project or location on the Green Silk Road network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, its goals, and impact (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-destructive' : ''}
              disabled={isSubmitting}
              rows={4}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 35.6762"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                className={errors.latitude ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., 139.6503"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                className={errors.longitude ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Input
              id="type"
              placeholder="e.g., farm, workshop, community center (optional)"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className={errors.type ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Adding Project...' : 'Add Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectEntryForm;
