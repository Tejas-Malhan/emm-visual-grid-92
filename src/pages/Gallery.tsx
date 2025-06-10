
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, X } from "lucide-react";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  // Mock data for gallery items
  const galleryItems = [
    { id: 1, artist: "Emma", description: "Urban landscape at golden hour", category: "landscape" },
    { id: 2, artist: "Marcus", description: "Street photography series", category: "street" },
    { id: 3, artist: "Maya", description: "Portrait session in natural light", category: "portrait" },
    { id: 4, artist: "Emma", description: "Architecture study downtown", category: "architecture" },
    { id: 5, artist: "Marcus", description: "Concert photography", category: "event" },
    { id: 6, artist: "Maya", description: "Fashion editorial shoot", category: "fashion" },
    { id: 7, artist: "Emma", description: "Nature macro photography", category: "nature" },
    { id: 8, artist: "Marcus", description: "Documentary series", category: "documentary" },
    { id: 9, artist: "Maya", description: "Wedding celebration", category: "event" },
  ];

  const artists = ["all", "Emma", "Marcus", "Maya"];
  const categories = ["all", "landscape", "street", "portrait", "architecture", "event", "fashion", "nature", "documentary"];

  const filteredItems = galleryItems.filter(item => 
    filter === "all" || item.artist === filter || item.category === filter
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-lg font-semibold">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Photo Gallery</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <section className="py-8 px-6 border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {[...artists, ...categories.slice(1)].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className="capitalize"
              >
                {filterOption}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="aspect-[9/16] bg-muted rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 relative"
                onClick={() => setSelectedImage(index)}
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge variant="secondary" className="mb-1 text-xs">
                    {item.artist}
                  </Badge>
                  <p className="text-white text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="max-w-2xl w-full">
            <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-4">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <Camera className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </div>
            
            <div className="text-center text-white">
              <Badge variant="secondary" className="mb-2">
                {filteredItems[selectedImage]?.artist}
              </Badge>
              <p className="text-lg">{filteredItems[selectedImage]?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
