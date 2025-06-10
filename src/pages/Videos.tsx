
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, X, Grid3X3, List } from "lucide-react";
import { Link } from "react-router-dom";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data for video items
  const videoItems = [
    { id: 1, artist: "Emma", title: "City Lights", description: "A cinematic journey through urban landscapes", category: "cinematic" },
    { id: 2, artist: "Marcus", title: "Live Session", description: "Behind the scenes of a recording session", category: "music" },
    { id: 3, artist: "Maya", title: "Wedding Story", description: "Capturing love in motion", category: "wedding" },
    { id: 4, artist: "Emma", title: "Product Showcase", description: "Commercial video for fashion brand", category: "commercial" },
    { id: 5, artist: "Marcus", title: "Documentary", description: "Short documentary about local artists", category: "documentary" },
    { id: 6, artist: "Maya", title: "Event Highlights", description: "Corporate event coverage", category: "event" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              EMM
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/gallery" className="text-gray-700 hover:text-black transition-colors font-medium">
                Gallery
              </Link>
              <Link to="/videos" className="text-gray-700 hover:text-black transition-colors font-medium">
                Videos
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-black transition-colors font-medium">
                About
              </Link>
              <Link to="/members" className="text-gray-700 hover:text-black transition-colors font-medium">
                Members
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-black transition-colors font-medium">
                Contact
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-black transition-colors font-medium">
                Admin
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-black text-white hover:bg-gray-800"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-6">Videos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Moving stories captured in cinematic detail
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoItems.map((item, index) => (
              <div
                key={item.id}
                className="aspect-video bg-gray-200 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedVideo(index)}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                  <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                    <Play className="h-8 w-8 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {videoItems.map((item, index) => (
              <div
                key={item.id}
                className="grid md:grid-cols-2 gap-8 items-center cursor-pointer group"
                onClick={() => setSelectedVideo(index)}
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                    <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                      <Play className="h-8 w-8 text-black" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">{item.artist}</p>
                  <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo !== null && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 z-10 hover:bg-gray-100"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="max-w-4xl w-full">
            <div className="aspect-video bg-gray-200 mb-8 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-6">
                  <Play className="h-12 w-12 text-black" />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">{videoItems[selectedVideo]?.artist}</p>
              <h3 className="text-3xl font-light mb-4">{videoItems[selectedVideo]?.title}</h3>
              <p className="text-lg text-gray-600">{videoItems[selectedVideo]?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
