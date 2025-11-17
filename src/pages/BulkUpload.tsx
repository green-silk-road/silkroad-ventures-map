import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BulkUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBulkUpload = async () => {
    setIsUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload projects",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke('bulk-upload-projects', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Upload successful!",
        description: `${data.count} projects have been added to the map`,
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading projects",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">Bulk Upload Projects</h1>
          <p className="text-muted-foreground mb-6">
            This will upload 14 pre-defined projects from your CSV file to the database.
            All projects will be associated with your user account.
          </p>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Projects to be uploaded:</h2>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Another School is Possible (Turkey)</li>
              <li>• Earthist (Turkey)</li>
              <li>• Bread Houses Network (Bulgaria)</li>
              <li>• Keystone Foundation (India)</li>
              <li>• Just Change (India)</li>
              <li>• Sristi Village (India)</li>
              <li>• Puvidham (India)</li>
              <li>• Marudam (India)</li>
              <li>• reStore / OFM (India)</li>
              <li>• Raddis cotton (India)</li>
              <li>• DDS - Disha (India)</li>
              <li>• Siddarth Ecovillage (India)</li>
              <li>• Gender Lab (India)</li>
              <li>• SEWA Trade Facilitation Centre (India)</li>
            </ul>
          </div>

          <Button 
            onClick={handleBulkUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload All Projects"
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BulkUpload;
