
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Video, Users, Mail, Instagram, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
              EMM
            </Link>
            <Navigation />
            <Button variant="ghost" size="sm" className="md:hidden">
              Menu
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-none">
                <span className="block">Visual</span>
                <span className="block text-primary">Stories</span>
                <span className="block">That Matter</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Team EMM crafts compelling visual narratives through photography and videography that capture authentic moments and emotions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group" asChild>
                  <Link to="/gallery">
                    Explore Gallery
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/videos">
                    Watch Videos
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-16 w-16 text-primary/50" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From intimate portraits to grand events, we bring your vision to life through our lens
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Photography",
                description: "Capturing moments with artistic vision and technical excellence"
              },
              {
                icon: Video,
                title: "Videography", 
                description: "Creating cinematic narratives that tell your story"
              },
              {
                icon: Users,
                title: "Events",
                description: "Documenting your special occasions with style and professionalism"
              }
            ].map((service, index) => (
              <div key={service.title} className="group p-8 rounded-2xl bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <service.icon className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Recent Work</h2>
              <p className="text-xl text-muted-foreground">A glimpse into our latest projects</p>
            </div>
            <Button variant="ghost" className="group" asChild>
              <Link to="/gallery">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your vision to life through compelling visual storytelling
          </p>
          <Button size="lg" variant="secondary" className="group" asChild>
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold tracking-tight mb-4">EMM</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Professional photography and videography services that capture the essence of your story.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:hello@teamemm.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/gallery" className="hover:text-primary transition-colors">Photography</Link></li>
                <li><Link to="/videos" className="hover:text-primary transition-colors">Videography</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Events</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/members" className="hover:text-primary transition-colors">Team</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Team EMM. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
