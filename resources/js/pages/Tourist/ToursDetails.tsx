import { use, useState } from "react";
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
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
import { Link, usePage, useForm } from '@inertiajs/react';
import { motion } from "framer-motion";
import { ca, de } from "date-fns/locale";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tours Details',
        href: route('tourist.tourDetails', { destination: 1 }),
    },
];

interface Destination {
  id: number;
  name: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  bookings: number;
  description: string;
  status: string;
  image: string;        
  created_at: string;
  updated_at: string;
}

interface PageProps {
  destination: Destination;
}

export default function TourDetails({destination}: PageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
 const { post, processing } = useForm({
    destination_id: destination.id,
  });
  console.log(destination);

  const formatPrice = (price: number | string) => {
  return `₱${Number(price).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
  })}`;
  };
  // Mock data - in real app this would come from API
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
        <div className="py-6">
          <Link
            href={route('tourist.dashboard')}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-8">{destination.name}</h2>

        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Left section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-secondary text-secondary-foreground">
                  {destination.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{destination.location}</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(destination.price)}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <Link href={route('tourist.tourBookings', { destination: destination.id })}>
                <Button className="w-full btn-ocean h-12 text-lg">
                  Book Now
                </Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
