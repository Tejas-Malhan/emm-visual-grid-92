import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Video, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const About = () => {
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
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-none">Our Story</h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Team EMM is a collective of passionate visual storytellers dedicated to capturing authentic moments and creating compelling narratives through photography and videography.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light tracking-tight mb-8">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that every moment has a story worth telling. Through our lens, we capture not just images and videos, but emotions, connections, and the essence of human experience.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our work spans across various genres - from intimate portraits to grand events, from street photography to cinematic narratives. We're committed to excellence in every frame.
              </p>
            </div>
            <div className="aspect-square bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Heart className="h-20 w-20 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-light tracking-tight text-center mb-16">What We Stand For</h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <Camera className="h-10 w-10 text-gray-600" />
              </div>
              <h4 className="text-2xl font-light mb-6">Authenticity</h4>
              <p className="text-gray-600 leading-relaxed">
                We capture genuine moments and real emotions, creating images that tell true stories without artificial facades.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <Video className="h-10 w-10 text-gray-600" />
              </div>
              <h4 className="text-2xl font-light mb-6">Innovation</h4>
              <p className="text-gray-600 leading-relaxed">
                We constantly push creative boundaries, experimenting with new techniques and technologies to bring fresh perspectives.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <Heart className="h-10 w-10 text-gray-600" />
              </div>
              <h4 className="text-2xl font-light mb-6">Collaboration</h4>
              <p className="text-gray-600 leading-relaxed">
                We work closely with our subjects and clients to ensure every project reflects their unique vision and story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-light tracking-tight mb-8">Let's Create Together</h3>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Whether you're looking for event coverage, portrait sessions, or creative collaborations, we'd love to hear about your vision and bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50" asChild>
              <Link to="/members">Meet the Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
