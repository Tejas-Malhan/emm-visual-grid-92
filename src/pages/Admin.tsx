
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Upload, Save } from "lucide-react";

const Admin = () => {
  const [photos, setPhotos] = useState([
    { id: 1, title: "Urban Landscape", artist: "Emma", description: "City at golden hour" },
    { id: 2, title: "Street Portrait", artist: "Marcus", description: "Candid moment" },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, title: "City Lights", artist: "Emma", description: "Cinematic urban journey" },
    { id: 2, title: "Live Session", artist: "Marcus", description: "Recording studio" },
  ]);

  const [newPhoto, setNewPhoto] = useState({ title: "", artist: "", description: "" });
  const [newVideo, setNewVideo] = useState({ title: "", artist: "", description: "" });

  const addPhoto = () => {
    if (newPhoto.title && newPhoto.artist) {
      setPhotos([...photos, { ...newPhoto, id: Date.now() }]);
      setNewPhoto({ title: "", artist: "", description: "" });
    }
  };

  const addVideo = () => {
    if (newVideo.title && newVideo.artist) {
      setVideos([...videos, { ...newVideo, id: Date.now() }]);
      setNewVideo({ title: "", artist: "", description: "" });
    }
  };

  const deletePhoto = (id: number) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const deleteVideo = (id: number) => {
    setVideos(videos.filter(video => video.id !== id));
  };

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
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-6">Admin Panel</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your portfolio content
          </p>
        </div>

        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Photo title"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                />
                <Input
                  placeholder="Artist name"
                  value={newPhoto.artist}
                  onChange={(e) => setNewPhoto({ ...newPhoto, artist: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={addPhoto} className="bg-black text-white hover:bg-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{photo.title}</h3>
                        <p className="text-gray-600 mb-1">By {photo.artist}</p>
                        <p className="text-gray-500">{photo.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deletePhoto(photo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Video title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
                <Input
                  placeholder="Artist name"
                  value={newVideo.artist}
                  onChange={(e) => setNewVideo({ ...newVideo, artist: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={addVideo} className="bg-black text-white hover:bg-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                        <p className="text-gray-600 mb-1">By {video.artist}</p>
                        <p className="text-gray-500">{video.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteVideo(video.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
