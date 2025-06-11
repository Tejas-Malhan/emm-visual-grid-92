
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, Video, Users, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Photography",
      description: "Capturing life's precious moments with artistic vision and technical excellence."
    },
    {
      icon: Video,
      title: "Videography", 
      description: "Creating compelling visual stories that engage and inspire audiences."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Working together to bring creative visions to life with seamless coordination."
    },
    {
      icon: Palette,
      title: "Creative Direction",
      description: "Providing artistic guidance and vision to ensure every project exceeds expectations."
    }
  ];

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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              Creative Excellence
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight">
              Visual <span className="text-primary font-normal">Storytelling</span>
              <br />Redefined
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We craft compelling visual narratives that captivate audiences and bring your creative vision to life through photography and videography.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/gallery">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/contact">
                  Get In Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              What We <span className="text-primary">Create</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive creative services cover every aspect of visual storytelling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Featured <span className="text-primary">Work</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A glimpse into our latest creative projects and collaborations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((item, index) => (
              <Card key={item} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted-foreground/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
                        <Camera className="h-12 w-12" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/gallery">
                View Full Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Ready to Create Something <span className="text-primary">Amazing?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Let's discuss your vision and bring it to life with our creative expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/members">
                Meet Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">EMM</h3>
              <p className="text-sm text-muted-foreground">
                Creative visual storytelling through photography and videography.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Work</h4>
              <div className="space-y-2 text-sm">
                <Link to="/gallery" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Gallery
                </Link>
                <Link to="/videos" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Videos
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <Link to="/members" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Team
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Connect</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>hello@teamamm.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Team EMM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
