
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import InstagramGallery from "@/components/InstagramGallery";
import { Link } from "react-router-dom";
import { sqlite3Db, MediaItem } from "@/services/sqlite3Database";

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        console.log('🖼️ Loading gallery photos from SQLite3 database...');
        await sqlite3Db.reloadFromDatabase();
        const items = sqlite3Db.getPhotoItems();
        console.log('✅ Photo items loaded from SQLite3:', items);
        setMediaItems(items);
      } catch (error) {
        console.error('❌ Error loading gallery items from SQLite3:', error);
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

      {/* Gallery Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Photo <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of stunning photography capturing life's most precious moments
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading gallery from SQLite3 database...</div>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">No photos available yet</div>
            <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <InstagramGallery mediaItems={mediaItems} />
        )}
      </div>
    </div>
  );
};

export default Gallery;
