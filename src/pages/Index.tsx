
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Video, Users, Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              EMM
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/gallery" className="text-gray-700 hover:text-black transition-colors font-medium">
                Gallery
              </Link>
              <Link to="/videos" className="text-gray-700 hover:text-black transition-colors font-medium">
                Videos
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-black transition-colors font-medium">
                About
              </Link>
              <Link to="/members" className="text-gray-700 hover:text-black transition-colors font-medium">
                Members
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-black transition-colors font-medium">
                Contact
              </Link>
            </div>
            <Button variant="outline" size="sm" className="md:hidden border-gray-300">
              Menu
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-none">
              Visual
              <br />
              Storytelling
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
              Team EMM captures moments that matter. Explore our collection of photography and videography that brings stories to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 border-0" asChild>
                <Link to="/gallery">
                  View Gallery
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50" asChild>
                <Link to="/videos">
                  Watch Videos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Featured Work</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A curated selection of our most compelling visual narratives, showcasing the diverse range of our creative vision.
              </p>
            </div>
            <div className="text-right">
              <Button variant="ghost" className="text-lg hover:bg-transparent" asChild>
                <Link to="/gallery">
                  View All Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="aspect-[4/5] bg-gray-200 overflow-hidden group cursor-pointer"
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">About EMM</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A collective of passionate visual artists dedicated to capturing authentic moments and creating compelling narratives through the lens.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our work spans across various genres - from intimate portraits to grand events, from street photography to cinematic narratives.
              </p>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">Let's Work Together</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you need photography, videography, or creative direction, Team EMM is here to bring your vision to life.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 border-0" asChild>
            <Link to="/contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                © 2025 Team EMM. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:hello@teamemm.com" className="text-gray-600 hover:text-black transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
