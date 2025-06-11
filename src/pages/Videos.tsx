
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { newFileDb, MediaItem } from "@/services/fileDatabase";

const Videos = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        console.log('🎥 Loading video media from FIXED localStorage database...');
        await newFileDb.reloadFromStorage();
        const items = newFileDb.getMediaItems().filter(item => item.type === 'video');
        console.log('✅ Video items loaded from FIXED localStorage database:', items);
        setMediaItems(items);
      } catch (error) {
        console.error('❌ Error loading video items from FIXED localStorage database:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

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

      {/* Videos Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Video <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our cinematic storytelling through carefully crafted video productions
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading videos from FIXED localStorage database...</div>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">No videos available yet</div>
            <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaItems.map((item, index) => (
              <Card key={item.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.cover_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
                      <Button size="lg" className="rounded-full h-16 w-16 p-0">
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-3">{item.description}</h3>
                    {item.credits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.credits.map((credit, creditIndex) => (
                          <Badge key={creditIndex} variant="secondary">
                            {credit}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </p>
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

export default Videos;
