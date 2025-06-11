
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, X, Grid3X3, List } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideoItems = async () => {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('type', 'video')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading video items:', error);
      } else {
        setVideoItems(data || []);
      }
      setLoading(false);
    };

    loadVideoItems();
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
          <div className="text-xl text-muted-foreground">Loading videos...</div>
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
            <div className="flex items-center gap-4">
              <Navigation />
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
              Our <span className="text-primary">Videos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A curated collection of our finest video work
            </p>
          </div>
        </div>
      </div>

      {/* Videos Content */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {videoItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No videos available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videoItems.map((item: any, index) => (
                    <div
                      key={item.id}
                      className="aspect-video bg-muted overflow-hidden group cursor-pointer rounded-lg"
                      onClick={() => setSelectedVideo(index)}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
                        <div className="bg-background/90 rounded-full p-4 group-hover:bg-background transition-colors shadow-lg">
                          <Play className="h-8 w-8 text-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {videoItems.map((item: any, index) => (
                    <div
                      key={item.id}
                      className="grid md:grid-cols-2 gap-8 items-center cursor-pointer group"
                      onClick={() => setSelectedVideo(index)}
                    >
                      <div className="aspect-video bg-muted overflow-hidden rounded-lg">
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
                          <div className="bg-background/90 rounded-full p-4 group-hover:bg-background transition-colors shadow-lg">
                            <Play className="h-8 w-8 text-foreground" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-light mb-4">{item.description || "Video"}</h3>
                        {item.credits && item.credits.length > 0 && (
                          <p className="text-muted-foreground">Credits: {item.credits.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo !== null && videoItems[selectedVideo] && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 z-10 hover:bg-muted"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="max-w-4xl w-full">
            <div className="aspect-video bg-muted mb-8 overflow-hidden rounded-lg">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="bg-background/90 rounded-full p-6 shadow-lg">
                  <Play className="h-12 w-12 text-foreground" />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-3xl font-light mb-4">{videoItems[selectedVideo]?.description || "Video"}</h3>
              {videoItems[selectedVideo]?.credits && videoItems[selectedVideo].credits.length > 0 && (
                <p className="text-lg text-muted-foreground">Credits: {videoItems[selectedVideo].credits.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
