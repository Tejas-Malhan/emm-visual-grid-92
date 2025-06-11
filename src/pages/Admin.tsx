
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { newFileDb, MediaItem, Member } from "@/services/fileDatabase";
import { LogOut, Upload, Users, Image, Video, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"media" | "users">("media");
  
  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  
  // User state
  const [users, setUsers] = useState<Member[]>([]);
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
  const [newInstagramHandle, setNewInstagramHandle] = useState("");
  const [newUserRole, setNewUserRole] = useState<'admin' | 'member'>('member');

  // Load media items from .db file database
  const loadMediaItems = async () => {
    try {
      console.log('Loading media items from .db file database...');
      await newFileDb.reloadFromStorage();
      const items = newFileDb.getMediaItems();
      console.log('Loaded media items from .db file database:', items);
      setMediaItems(items);
    } catch (error) {
      console.error('Error loading media items from .db file database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load media items from .db file database",
      });
    } finally {
      setLoadingMedia(false);
    }
  };

  // Load users from .db file database (only for admins)
  const loadUsers = async () => {
    if (userRole !== 'admin') return;
    
    try {
      await newFileDb.reloadFromStorage();
      const members = newFileDb.getMembers();
      console.log('Loaded members from .db file database:', members);
      setUsers(members);
    } catch (error) {
      console.error('Error loading users from .db file database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users from .db file database",
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

  const handleAddMedia = async () => {
    if (!newMediaCoverUrl || !newMediaDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in cover URL and description",
      });
      return;
    }

    try {
      console.log('Adding media to .db file database with data:', {
        type: newMediaType,
        cover_url: newMediaCoverUrl,
        media_urls: newMediaUrls.split(',').map(url => url.trim()).filter(url => url),
        description: newMediaDescription,
        credits: newMediaCredits.split(',').map(credit => credit.trim()).filter(credit => credit),
      });

      // If no media URLs provided, use cover URL as the single media URL
      const mediaUrls = newMediaUrls.trim() 
        ? newMediaUrls.split(',').map(url => url.trim()).filter(url => url)
        : [newMediaCoverUrl];

      const newItem = await newFileDb.addMediaItem({
        type: newMediaType,
        cover_url: newMediaCoverUrl,
        media_urls: mediaUrls,
        description: newMediaDescription,
        credits: newMediaCredits.split(',').map(credit => credit.trim()).filter(credit => credit),
      });

      console.log('Added media item to .db file database:', newItem);

      toast({
        title: "Success",
        description: "Media item saved to .db file database successfully",
      });
      
      // Reset form
      setNewMediaCoverUrl("");
      setNewMediaUrls("");
      setNewMediaDescription("");
      setNewMediaCredits("");
      
      // Reload media items
      await loadMediaItems();
    } catch (error) {
      console.error('Error adding media to .db file database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add media item to .db file database",
      });
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const success = await newFileDb.deleteMediaItem(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Media item deleted from .db file database successfully",
        });
        loadMediaItems();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete media item from .db file database",
        });
      }
    } catch (error) {
      console.error('Error deleting media from .db file database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media item from .db file database",
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
      const newUser = await newFileDb.addMember({
        username: newUsername,
        password_hash: newPassword,
        default_credit_name: newCreditName,
        instagram_handle: newInstagramHandle,
        role: newUserRole
      });

      console.log('Added user to .db file database:', newUser);

      toast({
        title: "Success",
        description: "User saved to .db file database successfully",
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
      console.error('Error adding user to .db file database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user to .db file database",
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

  const isAdmin = userRole === 'admin';
  const dbStats = newFileDb.getDatabaseStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? 'Admin Dashboard' : 'Media Upload Portal'}
            </h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}</p>
            <p className="text-xs text-muted-foreground">
              .db File Database | Items: {dbStats.mediaItems} | Users: {dbStats.members} | Version: {dbStats.version}
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
        )}

        {/* Media Management Tab - Always visible */}
        {(activeTab === "media" || !isAdmin) && (
          <div className="space-y-6">
            {/* Add Media Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Add New Media (.db File Database)
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
                  Add Media to .db File Database
                </Button>
              </CardContent>
            </Card>

            {/* Media List */}
            <Card>
              <CardHeader>
                <CardTitle>.db File Database Media ({mediaItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMedia ? (
                  <div className="text-center py-8">Loading media from .db file database...</div>
                ) : mediaItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No media items found in .db file database</div>
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
                            {/* Only show delete button for admins */}
                            {isAdmin && (
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
                                      Are you sure you want to delete this media item from the .db file database? This action cannot be undone.
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

        {/* User Management Tab - Only for admins */}
        {isAdmin && activeTab === "users" && (
          <div className="space-y-6">
            {/* Add User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New User (.db File Database)
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
                    <label className="text-sm font-medium">Instagram Handle</label>
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
                <Button onClick={handleAddUser} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User to .db File Database
                </Button>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>.db File Database Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading users from .db file database...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found in .db file database</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.default_credit_name || 'No credit name set'}
                          </p>
                          {user.instagram_handle && (
                            <p className="text-sm text-muted-foreground">
                              Instagram: {user.instagram_handle}
                            </p>
                          )}
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
