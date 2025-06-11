
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { db, Member } from "@/services/database";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        console.log('Loading members from SQLite database...');
        await db.reloadFromStorage();
        const allMembers = db.getMembers();
        console.log('Loaded members from SQLite database:', allMembers);
        setMembers(allMembers);
      } catch (error) {
        console.error('Error loading members from SQLite database:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

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

      {/* Members Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the creative minds behind our stunning visual storytelling
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading team members from SQLite database...</div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">No team members found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <Card key={member.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {member.default_credit_name ? member.default_credit_name.charAt(0).toUpperCase() : member.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {member.default_credit_name || member.username}
                  </h3>
                  <p className="text-muted-foreground mb-4 capitalize">{member.role}</p>
                  {member.instagram_handle && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://instagram.com/${member.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
