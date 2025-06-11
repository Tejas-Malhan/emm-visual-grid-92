
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaItem } from "@/services/database";

interface InstagramGalleryProps {
  mediaItems: MediaItem[];
}

const InstagramGallery = ({ mediaItems }: InstagramGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (item: MediaItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedItem && currentImageIndex < selectedItem.media_urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const currentImageUrl = selectedItem?.media_urls[currentImageIndex] || selectedItem?.cover_url;

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {mediaItems.map((item, index) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden border-0 cursor-pointer aspect-square relative"
            onClick={() => openModal(item)}
          >
            <CardContent className="p-0 h-full">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.cover_url}
                  alt={item.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Image failed to load:', item.cover_url);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop';
                  }}
                />
                {item.media_urls.length > 1 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                      +{item.media_urls.length - 1}
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for viewing images */}
      <Dialog open={!!selectedItem} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedItem?.description}</span>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="relative">
              <div className="aspect-square md:aspect-video max-h-[70vh] overflow-hidden">
                <img
                  src={currentImageUrl}
                  alt={selectedItem.description}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Modal image failed to load:', currentImageUrl);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop';
                  }}
                />
              </div>
              
              {/* Navigation arrows */}
              {selectedItem.media_urls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                    disabled={currentImageIndex === selectedItem.media_urls.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {/* Image counter */}
              {selectedItem.media_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedItem.media_urls.length}
                </div>
              )}
            </div>
          )}
          
          {/* Media info */}
          {selectedItem && (
            <div className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-2">
                {new Date(selectedItem.uploaded_at).toLocaleDateString()}
              </p>
              {selectedItem.credits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedItem.credits.map((credit, creditIndex) => (
                    <Badge key={creditIndex} variant="secondary" className="text-xs">
                      {credit}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstagramGallery;
