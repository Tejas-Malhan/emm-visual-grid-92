import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Upload, Save, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // States for media items
  const [mediaItems, setMediaItems] = useState([]);
  const [newMediaItem, setNewMediaItem] = useState({ 
    cover_url: "", 
    type: "photo",
    description: "",
    media_urls: [""],
    credits: [""]
  });

  // States for users
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    password: "", 
    default_credit_name: "",
    role: "member" as "admin" | "member"
  });

  // Loading states
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isAddingMediaItem, setIsAddingMediaItem] = useState(false);

  const loadMediaItems = async () => {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading media items:', error);
    } else {
      setMediaItems(data || []);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const createExampleMediaItem = async () => {
    if (user) {
      try {
        const exampleItem = {
          type: "photo",
          cover_url: "https://via.placeholder.com/400x300",
          media_urls: ["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"],
          description: "Example photo set from a recent shoot",
          uploaded_by_user_id: user.id,
          credits: ["John Doe", "Jane Smith"]
        };

        const { error } = await supabase.from('media_items').insert([exampleItem]);

        if (error) {
          console.error('Error creating example media item:', error);
        } else {
          console.log('Example media item created successfully');
          loadMediaItems();
        }
      } catch (error) {
        console.error('Error creating example media item:', error);
      }
    }
  };

  useEffect(() => {
    loadMediaItems();
    loadUsers();
    
    // Create example media item if no items exist
    const checkAndCreateExample = async () => {
      const { data } = await supabase.from('media_items').select('id').limit(1);
      if (data && data.length === 0) {
        createExampleMediaItem();
      }
    };
    
    checkAndCreateExample();
  }, []);

  const addMediaItem = async () => {
    if (newMediaItem.cover_url && user) {
      setIsAddingMediaItem(true);
      
      try {
        const { error } = await supabase.from('media_items').insert([{
          ...newMediaItem,
          uploaded_by_user_id: user.id,
          media_urls: newMediaItem.media_urls.filter(url => url.trim() !== ""),
          credits: newMediaItem.credits.filter(credit => credit.trim() !== "")
        }]);

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Media item added successfully",
        });
        setNewMediaItem({ 
          cover_url: "", 
          type: "photo",
          description: "",
          media_urls: [""],
          credits: [""]
        });
        loadMediaItems();
      } catch (error) {
        console.error('Error adding media item:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add media item",
        });
      } finally {
        setIsAddingMediaItem(false);
      }
    }
  };

  const createUser = async () => {
    if (newUser.username && newUser.password) {
      setIsCreatingUser(true);
      
      try {
        // Hash password (in production, use proper password hashing)
        const passwordHash = `$2b$10$${newUser.password}_placeholder_hash`;
        
        const { error } = await supabase.from('users').insert({
          username: newUser.username,
          password_hash: passwordHash,
          default_credit_name: newUser.default_credit_name || null,
          role: newUser.role,
        });

        if (error) {
          throw new Error(`Failed to create user: ${error.message}`);
        }

        toast({
          title: "Success",
          description: "User account created successfully",
        });
        setNewUser({ username: "", password: "", default_credit_name: "", role: "member" });
        loadUsers();
        
      } catch (error) {
        console.error('Error creating user:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create user account",
        });
      } finally {
        setIsCreatingUser(false);
      }
    }
  };

  const deleteMediaItem = async (id: string) => {
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media item",
      });
    } else {
      toast({
        title: "Success",
        description: "Media item deleted successfully",
      });
      loadMediaItems();
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

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

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              EMM
            </Link>
            <Navigation />
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-6">Admin Panel</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, type: e.target.value })}
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
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isAddingMediaItem}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingMediaItem ? "Adding..." : "Add Media Item"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {mediaItems.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
                        </h3>
                        <p className="text-gray-500 mb-2">{item.description}</p>
                        <p className="text-sm text-gray-400 mb-2">Cover: {item.cover_url}</p>
                        {item.media_urls && item.media_urls.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Media URLs ({item.media_urls.length}):</p>
                            <div className="text-xs text-gray-400">
                              {item.media_urls.slice(0, 2).map((url: string, index: number) => (
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
                            <p className="text-sm text-gray-500 mb-1">Credits:</p>
                            <p className="text-sm text-gray-400">{item.credits.join(', ')}</p>
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
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isCreatingUser}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreatingUser ? "Creating..." : "Create User"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {users.map((user: any) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
                        <p className="text-gray-600 mb-1">Default Credit: {user.default_credit_name || 'Not set'}</p>
                        <p className="text-gray-500">Role: {user.role}</p>
                        <p className="text-xs text-gray-400 mt-1">
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
