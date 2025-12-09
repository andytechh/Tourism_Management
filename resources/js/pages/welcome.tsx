import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ArrowRight, Play, MapPin, Mail, Phone, Facebook, Instagram, Twitter, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Heart } from "lucide-react";
import heroImage from "../pages/images/hero-donsol.jpg";
import donsoltims from "../pages/images/donsol-tmss.jfif";
import { useState, useRef, useEffect } from 'react';
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Swal from 'sweetalert2';

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  review_count: number;
  price: number;
  category: string;
}

interface Tour {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  rating: number;
}

interface WelcomeProps {
  auth: {
    user: {
      role: string;
    } | null;
  };
  tours: Tour[];
  topDestinations: Destination[];
  flash?: {
    success?: string;
  };
}

// CONTACT FORM COMPONENT
function ContactForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // FRONTEND VALIDATION
    const newErrors: any = {};

    if (!data.name.trim()) newErrors.name = "Name is required.";
    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Invalid email format.";

    if (!data.message.trim()) newErrors.message = "Message cannot be empty.";

    // If any errors exist, set errors locally and STOP submission.
    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([key, value]) => {
        errors[key] = value; // inertia's errors object
      });
      return;
    }

    // IF validation passed → submit to backend
    post(route('contact.send'), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent',
          text: 'Your message has been sent successfully. We will get back to you soon!',
        });
        reset();
      },
      onError: (err) => {
        console.error('Server validation errors:', err);
      }
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
      
      {errors && Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc pl-5 mt-2">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key} className="text-destructive">{value}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your name"
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea 
            rows={4}
            value={data.message}
            onChange={(e) => setData('message', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your message..."
          />
          {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
        </div>
        
        <Button 
          type="submit" 
          className="w-full btn-ocean" 
          disabled={processing}
        >
          {processing ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}

export default function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, tours = [], topDestinations = [], flash } = usePage<WelcomeProps>().props;
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Show success message
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: flash.success,
      });
    }
  }, [flash]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const getDashboard = () => {
    if (!auth.user) return '/dashboard';

    switch (auth.user.role) {
      case 'admin': return route('admin.dashboard');
      case 'staff': return route('staff.dashboard');
      case 'tourist':
      default: return route('tourist.dashboard');
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/default-destination.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return imagePath;
    return `/storage/${imagePath}`;
  };


  return (
    <>
      <Head title="Donsol Tourism Management System" />
      
      {/* Header */}
      <header className="fixed top-0 h-[85px] w-full z-50 bg-white border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection(heroRef)}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Donsol TMS
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection(heroRef)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection(toursRef)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Tours
              </button>
              <button 
                onClick={() => scrollToSection(aboutRef)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Contact
              </button>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {auth.user ? (
                <Link href={getDashboard()}>
                  <Button size="sm" className="btn-ocean">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="btn-ocean">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-border"
            >
              <div className="px-4 py-6 space-y-4">
                <button 
                  onClick={() => scrollToSection(heroRef)}
                  className="block text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection(toursRef)}
                  className="block text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Tours
                </button>
                <button 
                  onClick={() => scrollToSection(aboutRef)}
                  className="block text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection(contactRef)}
                  className="block text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Contact
                </button>
                
                <div className="pt-4 space-y-3">
                  {auth.user ? (
                    <Link 
                      href={getDashboard()} 
                      className="block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full btn-ocean">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" className="w-full btn-ocean">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Whale sharks swimming in Donsol waters"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium"
              >
                🐋 World's Best Whale Shark Destination
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Discover the Magic of
                <br />
                <span className="opacity-90 bg-clip-text bg-gradient-to-r from-secondary to-accent">
                  Donsol, Sorsogon
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                Experience swimming with gentle whale sharks, explore pristine waters, 
                and immerse yourself in the natural beauty of the Philippines' premier eco-tourism destination.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              >
                <Button
                  variant="outline"
                  onClick={() => scrollToSection(toursRef)}
                  className="btn-glass px-8 py-4 text-lg font-semibold mb-5"
                >
                  Explore Tours
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </motion.div>

              {/* Scroll Down Indicator */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/90"
              >
                <ChevronDown className="h-6 w-6 animate-bounce" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TOURS SECTION */}
        {(tours.length > 0 || topDestinations.length > 0) && (
          <section ref={toursRef} className="py-20 bg-gradient-to-br from-background to-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Signature Tours</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience the wonders of Donsol with our carefully curated eco-tourism packages
                </p>
              </div>
              
              {/* Display tours if available */}
              {tours.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {tours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={getImageUrl(tour.image)}
                          alt={tour.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-destination.jpg';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {tour.category}
                          </Badge>
                          <span className="text-2xl font-bold text-primary">{tour.price}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {tour.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <Link href={route('tourist.tours')}>
                            <Button size="sm" className="btn-ocean">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Display top destinations if available */}
              {topDestinations.length > 0 && (
                <>
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">Top-Rated Experiences</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Discover what our visitors love most about Donsol
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topDestinations.map((dest, index) => (
                      <motion.div
                        key={dest.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={getImageUrl(dest.image)}
                            alt={dest.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-destination.jpg';
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {dest.category}
                            </Badge>
                            <span className="text-2xl font-bold text-primary">₱{dest.price}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {dest.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{dest.rating?.toFixed(1) || '0.0'}</span>
                              <span className="text-sm text-muted-foreground">
                                ({dest.review_count} {dest.review_count === 1 ? 'review' : 'reviews'})
                              </span>
                            </div>
                            <Link href={route('tours.show', dest.id)}>
                              <Button size="sm" className="btn-ocean">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="text-center mt-12">
                <Link href="/tourist/tours">
                  <Button variant="outline" className="btn-glass px-8">
                    View All Tours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT SECTION */}
        <section ref={aboutRef} className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">About Donsol</h2>
                <p className="text-muted-foreground mb-4">
                  Donsol, Sorsogon is globally recognized as the "Whale Shark Capital of the World." 
                  Our community-based tourism ensures sustainable practices that protect marine life 
                  while providing unforgettable experiences.
                </p>
                <p className="text-muted-foreground mb-6">
                  With over 25 years of eco-tourism expertise, we've helped thousands of visitors 
                  connect with nature while supporting local communities.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "50K+", label: "Visitors Annually" },
                    { value: "95%", label: "Success Rate" },
                    { value: "1998", label: "Since" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl h-96">
                <img src={donsoltims} alt="Donsol Tourism Management System" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>

            {/* TEAM SECTION */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-12">Project Team</h2>
              
              {/* DEVELOPER */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <code className="text-primary font-bold text-xl">👨‍💻</code>
                  </div>
                  <h3 className="text-2xl font-bold">Developer</h3>
                </div>
                <div className="flex justify-center">
                  <div className="bg-card border rounded-xl p-6 text-center hover:shadow-md transition-shadow w-full max-w-xs">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👨‍💻</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">Andy Lazarte</h4>
                    <p className="text-muted-foreground text-sm">Full-Stack Developer</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      <Badge variant="secondary">Laravel</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Inertia.js</Badge>
                      <Badge variant="secondary">MySQL</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCUMENTATION TEAM */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <FileText className="text-secondary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Documentation Team</h3>
                </div>
                <div className="flex justify-center gap-10 flex-wrap">
                  <div className="bg-card border rounded-xl p-6 text-center hover:shadow-md transition-shadow w-full max-w-xs">
                    <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-secondary w-12 h-12" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Reymond Viñas</h4>
                    <p className="text-muted-foreground text-sm">Documentation Specialist</p>
                  </div>
                  <div className="bg-card border rounded-xl p-6 text-center hover:shadow-md transition-shadow w-full max-w-xs">
                    <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-secondary w-12 h-12" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Ajay Espiritu</h4>
                    <p className="text-muted-foreground text-sm">Documentation Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section ref={contactRef} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions? Our team is ready to assist you with your Donsol adventure
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-muted-foreground">Donsol, Sorsogon, Philippines</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground">+63 (99) 3591-1684</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">tourism@donsoltms.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CONTACT FORM */}
              <ContactForm />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">Donsol TMS</span>
            </div>
            <p className="text-background/80 max-w-2xl mx-auto mb-6">
              Your gateway to experiencing the world's best whale shark destination
            </p>
            <div className="flex justify-center space-x-6 text-background/60">
              <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-secondary transition-colors">Sustainability</a>
            </div>
            <div className="mt-6 text-background/50 text-sm">
              © {new Date().getFullYear()} Donsol Tourism Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}