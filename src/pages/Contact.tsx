
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Ready to bring your vision to life? Get in touch with Team EMM and let's create something extraordinary.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Service Needed</Label>
                    <Select onValueChange={(value) => handleInputChange("service", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="videography">Videography</SelectItem>
                        <SelectItem value="wedding">Wedding Coverage</SelectItem>
                        <SelectItem value="event">Event Photography</SelectItem>
                        <SelectItem value="portrait">Portrait Session</SelectItem>
                        <SelectItem value="commercial">Commercial Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={6}
                    className="mt-1"
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're always excited to hear about new projects and collaborations. Whether you have a specific vision in mind or need guidance on your creative direction, we're here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">hello@teamamm.com</p>
                    <p className="text-muted-foreground">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">Available Mon-Fri, 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-muted-foreground">Based in Los Angeles, CA</p>
                    <p className="text-muted-foreground">Available for travel worldwide</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 bg-muted/30">
                <h4 className="font-semibold mb-3">What to expect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Initial consultation to understand your vision</li>
                  <li>• Detailed proposal with timeline and pricing</li>
                  <li>• Collaborative planning process</li>
                  <li>• Professional execution and delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
