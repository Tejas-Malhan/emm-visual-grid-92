import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sqlite3Db, MediaItem, Member } from "@/services/sqlite3Database";
import { LogOut, Upload, Users, Image, Video, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"media" | "users">("media");
  
  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [addingMedia, setAddingMedia] = useState(false);
  
  // User state
  const [users, setUsers] = useState<Member[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  
  // Form states
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newMediaCoverUrl, setNewMediaCoverUrl] = useState("");
  const [newMediaUrls, setNewMediaUrls] = useState("");
  const [newMediaDescription, setNewMediaDescription] = useState("");
  const [newMediaCredits, setNewMediaCredits] = useState("");
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCreditName, setNewCreditName] = useState("");
  const [newInstagramHandle, setNewInstagramHandle] = useState("");
  const [newUserRole, setNewUserRole] = useState<'admin' | 'member'>('member');

  // Load media items from SQLite3 database
  const loadMediaItems = async () => {
    try {
      setLoadingMedia(true);
      const items = await sqlite3Db.getMediaItems();
      setMediaItems(items);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load media items",
      });
    } finally {
      setLoadingMedia(false);
    }
  };

  // Load users from SQLite3 database
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const members = await sqlite3Db.getMembers();
      setUsers(members);
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
    if (userRole === 'admin') {
      loadUsers();
    }
  }, [userRole]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddMedia = async () => {
    if (!newMediaCoverUrl || !newMediaDescription) {
      toast({
        variant: "destructive",
        title: "Required Fields",
        description: "Cover URL and description are required",
      });
      return;
    }

    if (!isValidUrl(newMediaCoverUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid cover URL",
      });
      return;
    }

    try {
      setAddingMedia(true);
      const mediaUrls = newMediaUrls.trim() 
        ? newMediaUrls.split(',').map(url => url.trim()).filter(url => url && isValidUrl(url))
        : [newMediaCoverUrl];

      await sqlite3Db.addMediaItem({
        type: newMediaType,
        cover_url: newMediaCoverUrl,
        media_urls: mediaUrls,
        description: newMediaDescription,
        credits: newMediaCredits.split(',').map(credit => credit.trim()).filter(credit => credit),
      });

      toast({
        title: "Success",
        description: "Media item added successfully",
      });
      
      // Reset form
      setNewMediaCoverUrl("");
      setNewMediaUrls("");
      setNewMediaDescription("");
      setNewMediaCredits("");
      
      // Reload media
      await loadMediaItems();
    } catch (error) {
      console.error('Error adding media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add media item",
      });
    } finally {
      setAddingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const success = await sqlite3Db.deleteMediaItem(id);
      if (success) {
        toast({
          title: "Deleted",
          description: "Media item removed successfully",
        });
        loadMediaItems();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete media item",
        });
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
        title: "Required Fields",
        description: "Username and password are required",
      });
      return;
    }

    try {
      setAddingUser(true);
      await sqlite3Db.addMember({
        username: newUsername,
        password_hash: newPassword,
        default_credit_name: newCreditName,
        instagram_handle: newInstagramHandle,
        role: newUserRole
      });

      toast({
        title: "Success",
        description: "User added successfully",
      });
      
      // Reset form
      setNewUsername("");
      setNewPassword("");
      setNewCreditName("");
      setNewInstagramHandle("");
      setNewUserRole('member');
      
      // Reload users
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user",
      });
    } finally {
      setAddingUser(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out",
    });
  };

  const isAdmin = userRole === 'admin';
  const dbStats = sqlite3Db.getDatabaseStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? 'Admin Dashboard' : 'Media Portal'}
            </h1>
            <p className="text-muted-foreground">Welcome, {user?.username}</p>
            <p className="text-xs text-muted-foreground">
              Photos: {dbStats.photoItems} | Videos: {dbStats.videoItems} | Users: {dbStats.members}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Tabs - Only show for admins */}
        {isAdmin && (
          <div className="flex gap-4 mb-8">
            <Button
              variant={activeTab === "media" ? "default" : "outline"}
              onClick={() => setActiveTab("media")}
            >
              <Image className="h-4 w-4 mr-2" />
              Media
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
          </div>
        )}

        {/* Media Management */}
        {(activeTab === "media" || !isAdmin) && (
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
                <Button 
                  onClick={handleAddMedia} 
                  className="w-full"
                  disabled={addingMedia}
                >
                  {addingMedia ? "Saving..." : "Add Media"}
                </Button>
              </CardContent>
            </Card>

            {/* Media List */}
            <Card>
              <CardHeader>
                <CardTitle>Media Library ({mediaItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMedia ? (
                  <div className="text-center py-8">Loading media...</div>
                ) : mediaItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No media found</div>
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
                            {isAdmin && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Delete this media item? This action cannot be undone.
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
                            )}
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

        {/* User Management */}
        {isAdmin && activeTab === "users" && (
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
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      placeholder="Name for credits"
                      value={newCreditName}
                      onChange={(e) => setNewCreditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <Input
                      placeholder="@username"
                      value={newInstagramHandle}
                      onChange={(e) => setNewInstagramHandle(e.target.value)}
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
                <Button 
                  onClick={handleAddUser} 
                  className="w-full"
                  disabled={addingUser}
                >
                  {addingUser ? "Saving..." : "Add User"}
                </Button>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>User Accounts ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{user.username}</h4>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </div>
                          {user.default_credit_name && (
                            <p className="text-sm text-muted-foreground">
                              Display Name: {user.default_credit_name}
                            </p>
                          )}
                          {user.instagram_handle && (
                            <p className="text-sm text-muted-foreground">
                              Instagram: {user.instagram_handle}
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
      </div>
    </div>
  );
};

export default Admin;
