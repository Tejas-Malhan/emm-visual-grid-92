
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Upload, Users, Image, Video, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  cover_url: string;
  media_urls: string[];
  description: string;
  credits: string[];
  uploaded_at: string;
}

interface User {
  id: string;
  username: string;
  default_credit_name: string;
  role: 'admin' | 'member';
  created_at: string;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"media" | "users">("media");
  
  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  // Form states
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newMediaCoverUrl, setNewMediaCoverUrl] = useState("");
  const [newMediaUrls, setNewMediaUrls] = useState("");
  const [newMediaDescription, setNewMediaDescription] = useState("");
  const [newMediaCredits, setNewMediaCredits] = useState("");
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCreditName, setNewCreditName] = useState("");
  const [newUserRole, setNewUserRole] = useState<'admin' | 'member'>('member');

  // Load media items
  const loadMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading media items:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load media items",
        });
      } else if (data) {
        // Type-safe conversion from Supabase data to MediaItem
        const typedMediaItems: MediaItem[] = data.map(item => ({
          id: item.id,
          type: item.type as 'photo' | 'video', // Type assertion since we control the data
          cover_url: item.cover_url,
          media_urls: item.media_urls || [],
          description: item.description || '',
          credits: item.credits || [],
          uploaded_at: item.created_at || new Date().toISOString()
        }));
        setMediaItems(typedMediaItems);
      }
    } catch (error) {
      console.error('Error loading media items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load media items",
      });
    } finally {
      setLoadingMedia(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading users:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users",
        });
      } else if (data) {
        // Type-safe conversion from Supabase data to User
        const typedUsers: User[] = data.map(user => ({
          id: user.id,
          username: user.username,
          default_credit_name: user.default_credit_name || '',
          role: user.role as 'admin' | 'member',
          created_at: user.created_at || new Date().toISOString()
        }));
        setUsers(typedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadMediaItems();
    loadUsers();
  }, []);

  const handleAddMedia = async () => {
    if (!newMediaCoverUrl || !newMediaDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('media_items')
        .insert({
          type: newMediaType,
          cover_url: newMediaCoverUrl,
          media_urls: newMediaUrls.split(',').map(url => url.trim()).filter(url => url),
          description: newMediaDescription,
          credits: newMediaCredits.split(',').map(credit => credit.trim()).filter(credit => credit),
          uploaded_by_user_id: user?.id || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding media:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add media item",
        });
      } else {
        toast({
          title: "Success",
          description: "Media item added successfully",
        });
        
        // Reset form
        setNewMediaCoverUrl("");
        setNewMediaUrls("");
        setNewMediaDescription("");
        setNewMediaCredits("");
        
        // Reload media items
        loadMediaItems();
      }
    } catch (error) {
      console.error('Error adding media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add media item",
      });
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting media:', error);
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
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media item",
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in username and password",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: newUsername,
          password_hash: newPassword, // In production, this should be properly hashed
          default_credit_name: newCreditName,
          role: newUserRole
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add user",
        });
      } else {
        toast({
          title: "Success",
          description: "User added successfully",
        });
        
        // Reset form
        setNewUsername("");
        setNewPassword("");
        setNewCreditName("");
        setNewUserRole('member');
        
        // Reload users
        loadUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "media" ? "default" : "outline"}
            onClick={() => setActiveTab("media")}
          >
            <Image className="h-4 w-4 mr-2" />
            Media Management
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
        </div>

        {/* Media Management Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            {/* Add Media Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Add New Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as 'photo' | 'video')}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cover URL *</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newMediaCoverUrl}
                      onChange={(e) => setNewMediaCoverUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Media URLs (comma separated)</label>
                    <Input
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      value={newMediaUrls}
                      onChange={(e) => setNewMediaUrls(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <Input
                      placeholder="Description of the media"
                      value={newMediaDescription}
                      onChange={(e) => setNewMediaDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Credits (comma separated)</label>
                    <Input
                      placeholder="John Doe, Jane Smith"
                      value={newMediaCredits}
                      onChange={(e) => setNewMediaCredits(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAddMedia} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Media
                </Button>
              </CardContent>
            </Card>

            {/* Media List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Media</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMedia ? (
                  <div className="text-center py-8">Loading media...</div>
                ) : mediaItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No media items found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                          <img
                            src={item.cover_url}
                            alt={item.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={item.type === 'photo' ? 'default' : 'secondary'}>
                              {item.type === 'photo' ? <Image className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                              {item.type}
                            </Badge>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Media</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this media item? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMedia(item.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <p className="text-sm font-medium">{item.description}</p>
                          {item.credits.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Credits: {item.credits.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Add User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username *</label>
                    <Input
                      placeholder="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password *</label>
                    <Input
                      type="password"
                      placeholder="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Credit Name</label>
                    <Input
                      placeholder="Display name for credits"
                      value={newCreditName}
                      onChange={(e) => setNewCreditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'member')}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleAddUser} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.default_credit_name || 'No credit name set'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
