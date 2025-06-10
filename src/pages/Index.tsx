
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Video, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              Team EMM
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/gallery" className="text-foreground/80 hover:text-foreground transition-colors">
                Gallery
              </Link>
              <Link to="/videos" className="text-foreground/80 hover:text-foreground transition-colors">
                Videos
              </Link>
              <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/members" className="text-foreground/80 hover:text-foreground transition-colors">
                Members
              </Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <Button variant="outline" size="sm" className="md:hidden">
              Menu
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Visual
              <span className="block text-muted-foreground">Storytelling</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Team EMM captures moments that matter. Explore our collection of photography and videography that brings stories to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/gallery">
                  <Camera className="mr-2 h-5 w-5" />
                  View Gallery
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/videos">
                  <Video className="mr-2 h-5 w-5" />
                  Watch Videos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="aspect-[9/16] bg-muted rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="ghost" className="text-lg" asChild>
              <Link to="/gallery">
                View All Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Highlights */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Team EMM</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A collective of passionate visual artists dedicated to capturing authentic moments and creating compelling narratives through the lens.
              </p>
              <Button variant="outline" asChild>
                <Link to="/members">
                  <Users className="mr-2 h-5 w-5" />
                  Meet the Team
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((member) => (
                <div
                  key={member}
                  className="aspect-square bg-muted rounded-lg overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you need photography, videography, or creative direction, Team EMM is here to bring your vision to life.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Team EMM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
