
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Video, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const teamMembers = [
    {
      name: "Emma Rodriguez",
      role: "Lead Photographer",
      specialties: ["Portrait", "Landscape", "Street Photography"],
      bio: "Emma brings 8 years of experience in capturing authentic moments. Her work focuses on natural lighting and genuine emotions, creating timeless images that tell compelling stories.",
      social: { instagram: "@emma_captures", email: "emma@teamamm.com" }
    },
    {
      name: "Marcus Chen",
      role: "Videographer & Director",
      specialties: ["Cinematic", "Documentary", "Music Videos"],
      bio: "Marcus specializes in cinematic storytelling and has directed numerous music videos and short films. His keen eye for movement and narrative creates captivating visual experiences.",
      social: { instagram: "@marcus_films", email: "marcus@teamamm.com" }
    },
    {
      name: "Maya Johnson",
      role: "Event & Wedding Photographer",
      specialties: ["Weddings", "Events", "Fashion"],
      bio: "Maya has a talent for capturing the energy and emotion of special moments. Her work in wedding and event photography has earned recognition for its artistic approach and attention to detail.",
      social: { instagram: "@maya_moments", email: "maya@teamamm.com" }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-lg font-semibold">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Our Team</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Meet Team EMM</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A diverse group of talented artists, each bringing their unique perspective and expertise to create extraordinary visual content.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">{member.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  <h3 className="text-3xl font-bold mb-2">{member.name}</h3>
                  <p className="text-xl text-muted-foreground mb-4">{member.role}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                      <Instagram className="mr-2 h-4 w-4" />
                      {member.social.instagram}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-muted-foreground">Photos Captured</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-3xl font-bold mb-6">Work With Us</h3>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Ready to collaborate? We'd love to discuss your project and see how we can bring your vision to life.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Start a Project</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Members;
