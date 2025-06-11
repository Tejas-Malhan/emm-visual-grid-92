import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Save, Users, LogOut, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { db, MediaItem, Member } from "@/services/database";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // States for media items
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newMediaItem, setNewMediaItem] = useState({ 
    cover_url: "", 
    type: "photo" as "photo" | "video",
    description: "",
    media_urls: [""],
    credits: [""]
  });

  // States for users
  const [users, setUsers] = useState<Member[]>([]);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    password: "", 
    default_credit_name: "",
    role: "member" as "admin" | "member"
  });

  // Loading states
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isAddingMediaItem, setIsAddingMediaItem] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.authenticateUser(loginData.username, loginData.password);
    
    if (user && user.role === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadData();
      toast.success("Welcome to admin panel!");
    } else {
      toast.error("Invalid credentials or insufficient permissions");
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  const loadData = () => {
    setMediaItems(db.getMediaItems());
    setUsers(db.getMembers());
  };

  const addMediaItem = () => {
    if (newMediaItem.cover_url) {
      setIsAddingMediaItem(true);
      
      try {
        db.addMediaItem({
          ...newMediaItem,
          media_urls: newMediaItem.media_urls.filter(url => url.trim() !== ""),
          credits: newMediaItem.credits.filter(credit => credit.trim() !== "")
        });

        toast.success("Media item added successfully");
        setNewMediaItem({ 
          cover_url: "", 
          type: "photo",
          description: "",
          media_urls: [""],
          credits: [""]
        });
        loadData();
      } catch (error) {
        console.error('Error adding media item:', error);
        toast.error("Failed to add media item");
      } finally {
        setIsAddingMediaItem(false);
      }
    }
  };

  const createUser = () => {
    if (newUser.username && newUser.password) {
      setIsCreatingUser(true);
      
      try {
        db.addMember({
          username: newUser.username,
          password_hash: newUser.password, // In production, hash this properly
          default_credit_name: newUser.default_credit_name || newUser.username,
          role: newUser.role,
        });

        toast.success("User account created successfully");
        setNewUser({ username: "", password: "", default_credit_name: "", role: "member" });
        loadData();
        
      } catch (error) {
        console.error('Error creating user:', error);
        toast.error("Failed to create user account");
      } finally {
        setIsCreatingUser(false);
      }
    }
  };

  const deleteMediaItem = (id: string) => {
    if (db.deleteMediaItem(id)) {
      toast.success("Media item deleted successfully");
      loadData();
    } else {
      toast.error("Failed to delete media item");
    }
  };

  // Helper functions for dynamic fields
  const addMediaUrl = () => {
    setNewMediaItem(prev => ({
      ...prev,
      media_urls: [...prev.media_urls, ""]
    }));
  };

  const updateMediaUrl = (index: number, value: string) => {
    setNewMediaItem(prev => ({
      ...prev,
      media_urls: prev.media_urls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeMediaUrl = (index: number) => {
    setNewMediaItem(prev => ({
      ...prev,
      media_urls: prev.media_urls.filter((_, i) => i !== index)
    }));
  };

  const addCredit = () => {
    setNewMediaItem(prev => ({
      ...prev,
      credits: [...prev.credits, ""]
    }));
  };

  const updateCredit = (index: number, value: string) => {
    setNewMediaItem(prev => ({
      ...prev,
      credits: prev.credits.map((credit, i) => i === index ? value : credit)
    }));
  };

  const removeCredit = (index: number) => {
    setNewMediaItem(prev => ({
      ...prev,
      credits: prev.credits.filter((_, i) => i !== index)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              EMM
            </Link>
            <div className="flex items-center gap-4">
              <Navigation />
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-6">Admin Panel</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your media content and team members
          </p>
        </div>

        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="media">Media Items</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Media Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Cover URL"
                  value={newMediaItem.cover_url}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, cover_url: e.target.value })}
                />
                <select
                  className="w-full p-2 border rounded-md"
                  value={newMediaItem.type}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, type: e.target.value as "photo" | "video" })}
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
                <Textarea
                  placeholder="Description (max 200 characters)"
                  value={newMediaItem.description}
                  maxLength={200}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, description: e.target.value })}
                />
                
                <div>
                  <label className="text-sm font-medium">Media URLs:</label>
                  {newMediaItem.media_urls.map((url, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder="Media URL"
                        value={url}
                        onChange={(e) => updateMediaUrl(index, e.target.value)}
                      />
                      {newMediaItem.media_urls.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeMediaUrl(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addMediaUrl} className="mt-2">
                    Add Media URL
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium">Credits:</label>
                  {newMediaItem.credits.map((credit, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder="Credit name"
                        value={credit}
                        onChange={(e) => updateCredit(index, e.target.value)}
                      />
                      {newMediaItem.credits.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeCredit(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addCredit} className="mt-2">
                    Add Credit
                  </Button>
                </div>

                <Button 
                  onClick={addMediaItem} 
                  disabled={isAddingMediaItem}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingMediaItem ? "Adding..." : "Add Media Item"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {mediaItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
                        </h3>
                        <p className="text-muted-foreground mb-2">{item.description}</p>
                        <p className="text-sm text-muted-foreground mb-2">Cover: {item.cover_url}</p>
                        {item.media_urls && item.media_urls.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-1">Media URLs ({item.media_urls.length}):</p>
                            <div className="text-xs text-muted-foreground">
                              {item.media_urls.slice(0, 2).map((url, index) => (
                                <div key={index} className="truncate">{url}</div>
                              ))}
                              {item.media_urls.length > 2 && (
                                <div>... and {item.media_urls.length - 2} more</div>
                              )}
                            </div>
                          </div>
                        )}
                        {item.credits && item.credits.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-1">Credits:</p>
                            <p className="text-sm text-muted-foreground">{item.credits.join(', ')}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deleteMediaItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Create New User Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <Input
                  placeholder="Password (minimum 6 characters)"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <Input
                  placeholder="Default Credit Name (optional)"
                  value={newUser.default_credit_name}
                  onChange={(e) => setNewUser({ ...newUser, default_credit_name: e.target.value })}
                />
                <select
                  className="w-full p-2 border rounded-md"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "member" })}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button 
                  onClick={createUser} 
                  disabled={isCreatingUser}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreatingUser ? "Creating..." : "Create User"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
                        <p className="text-muted-foreground mb-1">Default Credit: {user.default_credit_name || 'Not set'}</p>
                        <p className="text-muted-foreground">Role: {user.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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
