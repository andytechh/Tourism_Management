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


  const formatPrice = (price: number | string) => {
  return `₱${Number(price).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
  })}`;
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
