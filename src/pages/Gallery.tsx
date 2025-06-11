
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMediaItems = async () => {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('type', 'photo')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading media items:', error);
      } else {
        setMediaItems(data || []);
      }
      setLoading(false);
    };

    loadMediaItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold tracking-tight">
                EMM
              </a>
              <Navigation />
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold tracking-tight">
              EMM
            </a>
            <Navigation />
          </div>
        </div>
      </nav>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-6">Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A curated collection of our finest photographic work
          </p>
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No photos available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item: any) => (
              <Card key={item.id} className="group overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.cover_url}
                      alt={item.description || "Gallery photo"}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <p className="text-sm">{item.description}</p>
                        {item.credits && item.credits.length > 0 && (
                          <p className="text-xs text-gray-300 mt-1">
                            Credits: {item.credits.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
