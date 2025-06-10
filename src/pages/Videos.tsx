
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, X } from "lucide-react";
import { Link } from "react-router-dom";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  // Mock data for video items
  const videoItems = [
    { id: 1, artist: "Emma", title: "City Lights", description: "A cinematic journey through urban landscapes", category: "cinematic" },
    { id: 2, artist: "Marcus", title: "Live Session", description: "Behind the scenes of a recording session", category: "music" },
    { id: 3, artist: "Maya", title: "Wedding Story", description: "Capturing love in motion", category: "wedding" },
    { id: 4, artist: "Emma", title: "Product Showcase", description: "Commercial video for fashion brand", category: "commercial" },
    { id: 5, artist: "Marcus", title: "Documentary", description: "Short documentary about local artists", category: "documentary" },
    { id: 6, artist: "Maya", title: "Event Highlights", description: "Corporate event coverage", category: "event" },
  ];

  const artists = ["all", "Emma", "Marcus", "Maya"];
  const categories = ["all", "cinematic", "music", "wedding", "commercial", "documentary", "event"];

  const filteredItems = videoItems.filter(item => 
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
            <h1 className="text-2xl font-bold">Video Gallery</h1>
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

      {/* Video Grid */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="aspect-[9/16] bg-muted rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 relative"
                onClick={() => setSelectedVideo(index)}
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <div className="bg-background/80 rounded-full p-4 group-hover:bg-background transition-colors">
                    <Play className="h-8 w-8 text-foreground" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.artist}
                  </Badge>
                  <h3 className="text-white text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="max-w-3xl w-full">
            <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              <div className="bg-background/80 rounded-full p-6">
                <Play className="h-12 w-12 text-foreground" />
              </div>
            </div>
            
            <div className="text-center text-white">
              <Badge variant="secondary" className="mb-2">
                {filteredItems[selectedVideo]?.artist}
              </Badge>
              <h3 className="text-2xl font-bold mb-2">{filteredItems[selectedVideo]?.title}</h3>
              <p className="text-lg text-white/80">{filteredItems[selectedVideo]?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
