
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, X, Grid3X3, List } from "lucide-react";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data for gallery items
  const galleryItems = [
    { id: 1, artist: "Emma", title: "Urban Landscapes", description: "Golden hour cityscapes", category: "landscape" },
    { id: 2, artist: "Marcus", title: "Street Stories", description: "Candid street photography", category: "street" },
    { id: 3, artist: "Maya", title: "Natural Light", description: "Portrait session outdoors", category: "portrait" },
    { id: 4, artist: "Emma", title: "Architecture", description: "Downtown structures", category: "architecture" },
    { id: 5, artist: "Marcus", title: "Live Performance", description: "Concert photography", category: "event" },
    { id: 6, artist: "Maya", title: "Fashion Editorial", description: "Studio fashion shoot", category: "fashion" },
    { id: 7, artist: "Emma", title: "Nature Macro", description: "Close-up nature details", category: "nature" },
    { id: 8, artist: "Marcus", title: "Documentary", description: "Local artist profiles", category: "documentary" },
    { id: 9, artist: "Maya", title: "Wedding Day", description: "Intimate celebration", category: "event" },
  ];

  const filters = ["all", "Emma", "Marcus", "Maya", "landscape", "street", "portrait", "architecture", "event", "fashion", "nature", "documentary"];

  const filteredItems = galleryItems.filter(item => 
    filter === "all" || item.artist === filter || item.category === filter
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-lg font-medium">
              <ArrowLeft className="mr-3 h-5 w-5" />
              Back
            </Link>
            <h1 className="text-2xl font-light tracking-tight">Gallery</h1>
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

      {/* Filters */}
      <section className="py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className={filter === filterOption ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"}
              >
                {filterOption === "all" ? "All Work" : filterOption}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="aspect-[4/5] bg-gray-200 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid md:grid-cols-2 gap-8 items-center cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                      <Camera className="h-12 w-12 text-gray-400" />
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
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 z-10 hover:bg-gray-100"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="max-w-4xl w-full">
            <div className="aspect-[4/3] bg-gray-200 mb-8 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Camera className="h-20 w-20 text-gray-400" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">{filteredItems[selectedImage]?.artist}</p>
              <h3 className="text-3xl font-light mb-4">{filteredItems[selectedImage]?.title}</h3>
              <p className="text-lg text-gray-600">{filteredItems[selectedImage]?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
