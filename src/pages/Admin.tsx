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

  // States for posts
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    instagram_url: "", 
    title: "", 
    description: "", 
    post_type: "photo" 
  });

  // States for members
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ 
    email: "", 
    password: "", 
    full_name: "" 
  });

  // Loading states
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading posts:', error);
    } else {
      setPosts(data || []);
    }
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading members:', error);
    } else {
      setMembers(data || []);
    }
  };

  const createExamplePost = async () => {
    if (user) {
      try {
        const examplePost = {
          instagram_url: "https://www.instagram.com/p/ABC123/",
          title: "Beautiful Sunset Photography",
          description: "Captured this amazing sunset during our latest photo shoot. The golden hour lighting was absolutely perfect for this portrait session.",
          post_type: "photo",
          user_id: user.id,
          instagram_media_urls: ["https://www.instagram.com/p/ABC123/media/?size=l"]
        };

        const { error } = await supabase.from('posts').insert([examplePost]);

        if (error) {
          console.error('Error creating example post:', error);
        } else {
          console.log('Example post created successfully');
          loadPosts();
        }
      } catch (error) {
        console.error('Error creating example post:', error);
      }
    }
  };

  useEffect(() => {
    loadPosts();
    loadMembers();
    
    // Create example post if no posts exist
    const checkAndCreateExample = async () => {
      const { data } = await supabase.from('posts').select('id').limit(1);
      if (data && data.length === 0) {
        createExamplePost();
      }
    };
    
    checkAndCreateExample();
  }, []);

  // Extract Instagram media URLs from the post URL
  const extractInstagramMedia = (instagramUrl: string) => {
    try {
      // Simple extraction - in a real app, you'd use Instagram's API
      // For now, we'll just store the URL and create a placeholder media URL
      const postId = instagramUrl.split('/p/')[1]?.split('/')[0] || 
                    instagramUrl.split('/reel/')[1]?.split('/')[0];
      
      if (postId) {
        // This is a simplified approach - in production you'd use Instagram Basic Display API
        return [`https://www.instagram.com/p/${postId}/media/?size=l`];
      }
      return [];
    } catch (error) {
      console.error('Error extracting Instagram media:', error);
      return [];
    }
  };

  const addPost = async () => {
    if (newPost.instagram_url && newPost.title && user) {
      setIsAddingPost(true);
      
      try {
        // Extract media URLs from Instagram URL
        const mediaUrls = extractInstagramMedia(newPost.instagram_url);
        
        const { error } = await supabase.from('posts').insert([{
          ...newPost,
          user_id: user.id,
          instagram_media_urls: mediaUrls,
        }]);

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Post added successfully",
        });
        setNewPost({ instagram_url: "", title: "", description: "", post_type: "photo" });
        loadPosts();
      } catch (error) {
        console.error('Error adding post:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add post",
        });
      } finally {
        setIsAddingPost(false);
      }
    }
  };

  const createMember = async () => {
    if (newMember.email && newMember.password) {
      setIsCreatingMember(true);
      
      try {
        // Create user account with proper error handling
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: newMember.email,
          password: newMember.password,
          email_confirm: true,
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (!authData.user) {
          throw new Error('Failed to create user account');
        }

        // Wait a moment to ensure the user is fully created in auth.users
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create profile with proper error handling
        const { error: profileError } = await supabase.from('profiles').insert([{
          user_id: authData.user.id,
          email: newMember.email,
          full_name: newMember.full_name || null,
          role: 'member',
        }]);

        if (profileError) {
          // If profile creation fails, we should clean up the auth user
          console.error('Profile creation failed:', profileError);
          
          // Try to delete the created auth user
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (cleanupError) {
            console.error('Failed to cleanup auth user:', cleanupError);
          }
          
          throw new Error(`Failed to create member profile: ${profileError.message}`);
        }

        toast({
          title: "Success",
          description: "Member account created successfully",
        });
        setNewMember({ email: "", password: "", full_name: "" });
        loadMembers();
        
      } catch (error) {
        console.error('Error creating member:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create member account",
        });
      } finally {
        setIsCreatingMember(false);
      }
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post",
      });
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      loadPosts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
            Manage your content and team members
          </p>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Instagram Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Instagram Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Instagram URL (e.g., https://www.instagram.com/p/ABC123/)"
                  value={newPost.instagram_url}
                  onChange={(e) => setNewPost({ ...newPost, instagram_url: e.target.value })}
                />
                <Input
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                />
                <select
                  className="w-full p-2 border rounded-md"
                  value={newPost.post_type}
                  onChange={(e) => setNewPost({ ...newPost, post_type: e.target.value })}
                >
                  <option value="photo">Photo</option>
                  <option value="reel">Reel</option>
                </select>
                <Button 
                  onClick={addPost} 
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isAddingPost}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingPost ? "Adding..." : "Add Post"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {posts.map((post: any) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-1">Type: {post.post_type}</p>
                        <p className="text-gray-500 mb-2">{post.description}</p>
                        <a 
                          href={post.instagram_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mb-2 block"
                        >
                          View on Instagram
                        </a>
                        {post.instagram_media_urls && post.instagram_media_urls.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Media URLs:</p>
                            <div className="text-xs text-gray-400">
                              {post.instagram_media_urls.map((url: string, index: number) => (
                                <div key={index} className="truncate">{url}</div>
                              ))}
                            </div>
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
                          onClick={() => deletePost(post.id)}
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

          <TabsContent value="members" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Create New Member Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
                <Input
                  placeholder="Password (minimum 6 characters)"
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                />
                <Input
                  placeholder="Full Name (optional)"
                  value={newMember.full_name}
                  onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })}
                />
                <Button 
                  onClick={createMember} 
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isCreatingMember}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreatingMember ? "Creating..." : "Create Member"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {members.map((member: any) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{member.full_name || 'No name'}</h3>
                        <p className="text-gray-600 mb-1">{member.email}</p>
                        <p className="text-gray-500">Role: {member.role}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(member.created_at).toLocaleDateString()}
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
