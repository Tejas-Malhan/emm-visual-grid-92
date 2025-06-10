
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Video, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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
            <h1 className="text-2xl font-bold">About Team EMM</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Team EMM is a collective of passionate visual storytellers dedicated to capturing authentic moments and creating compelling narratives through photography and videography.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that every moment has a story worth telling. Through our lens, we capture not just images and videos, but emotions, connections, and the essence of human experience.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our work spans across various genres - from intimate portraits to grand events, from street photography to cinematic narratives. We're committed to excellence in every frame.
              </p>
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <Heart className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">What We Stand For</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Authenticity</h4>
              <p className="text-muted-foreground leading-relaxed">
                We capture genuine moments and real emotions, creating images that tell true stories without artificial facades.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Video className="h-10 w-10 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Innovation</h4>
              <p className="text-muted-foreground leading-relaxed">
                We constantly push creative boundaries, experimenting with new techniques and technologies to bring fresh perspectives.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Collaboration</h4>
              <p className="text-muted-foreground leading-relaxed">
                We work closely with our subjects and clients to ensure every project reflects their unique vision and story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-3xl font-bold mb-6">Let's Create Together</h3>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Whether you're looking for event coverage, portrait sessions, or creative collaborations, we'd love to hear about your vision and bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/members">Meet the Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
