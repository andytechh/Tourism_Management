import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useParams, Link } from "react-router-dom";
import { useState } from 'react';
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  ArrowLeft,
  Share2,
  Heart,
  Shield,
  Camera,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tourist-Dashboard',
        href: dashboard().url,
    },
];

export default function Home() {
 const { id } = useParams();
 const [selectedImage, setSelectedImage] = useState(0);
  const tour = {
    id: 1,
    title: "Whale Shark Interaction Experience",
    description: "Experience the thrill of swimming alongside the world's largest fish in the pristine waters of Donsol. Our certified guides ensure a safe and memorable encounter with these gentle giants while respecting their natural habitat.",
    longDescription: "Donsol Bay is home to one of the world's most reliable whale shark populations. These magnificent creatures, locally known as 'butanding', can grow up to 12 meters long but are completely harmless filter feeders. Our eco-friendly tours are conducted under strict guidelines to ensure the protection of these endangered species while providing you with an unforgettable wildlife encounter.",
    price: "₱1,500",
    originalPrice: "₱2,000",
    duration: "3-4 hours",
    maxGuests: 8,
    rating: 4.9,
    reviews: 247,
    difficulty: "Beginner",
    category: "Marine Adventure",
    availability: "Daily (November - June)",
    meetingPoint: "Donsol Visitor Center",
    meetingTime: "6:00 AM, 10:00 AM, 2:00 PM",
    
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&brightness=0.8"
    ],

    includes: [
      "Professional local guide",
      "Snorkeling equipment (mask, snorkel, fins)",
      "Life jacket",
      "Underwater photos/videos",
      "Safety briefing",
      "Boat transportation",
      "Light refreshments"
    ],

    notIncludes: [
      "Hotel pickup/drop-off",
      "Lunch",
      "Personal expenses",
      "Travel insurance"
    ],

    itinerary: [
      {
        time: "6:00 AM",
        activity: "Registration & Safety Briefing",
        description: "Arrive at Donsol Visitor Center for registration and comprehensive safety briefing"
      },
      {
        time: "6:30 AM", 
        activity: "Boat Departure",
        description: "Board traditional bancas and head to whale shark spotting areas"
      },
      {
        time: "7:00 AM - 9:30 AM",
        activity: "Whale Shark Interaction",
        description: "Swim with whale sharks under guidance of certified Butanding Interaction Officers"
      },
      {
        time: "10:00 AM",
        activity: "Return & Photo Review",
        description: "Return to visitor center and review underwater photos/videos taken during the tour"
      }
    ],

    highlights: [
      "Swim with the world's largest fish",
      "Learn about whale shark conservation",
      "Professional underwater photography",
      "Small group experience (max 8 people)",
      "Certified local guides",
      "Eco-friendly tourism practices"
    ],

    importantNotes: [
      "Whale shark sightings are not guaranteed as they are wild animals",
      "Tours are weather dependent and may be cancelled for safety",
      "Participants must be comfortable in water",
      "No touching or flash photography allowed",
      "Minimum age: 8 years old",
      "Sunscreen must be reef-safe only"
    ],

    reviewsList: [
      {
        id: 1,
        name: "Sarah Johnson",
        location: "California, USA",
        rating: 5,
        date: "2 weeks ago",
        text: "Absolutely incredible experience! Swimming with whale sharks was a dream come true. Our guide was knowledgeable and made sure we felt safe throughout the tour.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b4a3?w=50&h=50&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Marco Rodriguez", 
        location: "Madrid, Spain",
        rating: 5,
        date: "1 month ago",
        text: "The tour exceeded all expectations. Seeing these gentle giants up close was emotional. The guides respect the animals and ensure sustainable tourism practices.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
      },
      {
        id: 3,
        name: "Yuki Tanaka",
        location: "Tokyo, Japan", 
        rating: 5,
        date: "1 month ago",
        text: "Perfect organization and amazing experience. The underwater photos they took were stunning. Highly recommend for anyone visiting Donsol!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
      }
    ]
  };

return (
    <div className="min-h-screen bg-background">
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link 
            to="/tours" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img
                  src={tour.images[selectedImage]}
                  alt={tour.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {tour.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${tour.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Tour Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-secondary text-secondary-foreground">{tour.category}</Badge>
                  <Badge variant="outline">{tour.difficulty}</Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {tour.title}
                </h1>
                
                <div className="flex items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span>({tour.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Donsol, Sorsogon</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: "Duration", value: tour.duration },
                  { icon: Users, label: "Max Guests", value: tour.maxGuests },
                  { icon: Calendar, label: "Availability", value: "Daily" },
                  { icon: Shield, label: "Difficulty", value: tour.difficulty }
                ].map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 text-center">
                      <item.icon className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* About This Tour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About This Tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {tour.longDescription}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Tour Highlights</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {tour.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tour Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-20 text-sm font-semibold text-primary">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.activity}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Includes & Not Includes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-destructive rounded-full flex items-center justify-center">
                      <span className="w-2 h-0.5 bg-destructive"></span>
                    </span>
                    Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.notIncludes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-4 h-4 border border-destructive rounded-full flex items-center justify-center">
                          <span className="w-2 h-0.5 bg-destructive"></span>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-coral" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.importantNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 bg-coral rounded-full mt-2 flex-shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({tour.reviewsList.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tour.reviewsList.map((review) => (
                    <div key={review.id}>
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{review.name}</h4>
                            <span className="text-sm text-muted-foreground">{review.location}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.text}</p>
                        </div>
                      </div>
                      {review.id !== tour.reviewsList[tour.reviewsList.length - 1].id && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">{tour.price}</span>
                        <span className="text-lg text-muted-foreground line-through">{tour.originalPrice}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    <Badge className="bg-coral/10 text-coral border-coral">
                      25% OFF
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Meeting Point</p>
                      <p className="font-medium">{tour.meetingPoint}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meeting Time</p>
                      <p className="font-medium">{tour.meetingTime}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Link to={`/booking/${tour.id}`}>
                      <Button className="w-full btn-ocean h-12 text-lg">
                        Book Now
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Check Availability
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Free cancellation up to 24 hours before</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
