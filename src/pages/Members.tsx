
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Video, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading members:', error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };

    loadMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
                EMM
              </Link>
              <Navigation />
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl text-muted-foreground">Loading members...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
              EMM
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
              Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the talented individuals behind our creative work
            </p>
          </div>
        </div>
      </div>

      {/* Members Content */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {members.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No team members to display yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon to meet our team!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member: any) => (
                <div key={member.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{member.default_credit_name || member.username}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
