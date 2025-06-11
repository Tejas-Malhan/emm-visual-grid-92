
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
                EMM
              </Link>
              <Navigation />
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl text-muted-foreground">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
              EMM
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
              Our <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A curated collection of our finest photographic work
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {mediaItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No photos available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item: any, index) => (
                <Card key={item.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <img
                        src={item.cover_url}
                        alt={item.description || "Gallery photo"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {item.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="font-medium mb-2">{item.description}</p>
                          {item.credits && item.credits.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.credits.map((credit: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {credit}
                                </Badge>
                              ))}
                            </div>
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
    </div>
  );
};

export default Gallery;
