import { useState, useEffect } from "react";
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
import { Link, usePage, useForm, router, Head } from '@inertiajs/react';
import { motion } from "framer-motion";
import { toast } from 'sonner'; // Add this import
import appLayout from "@/layouts/app-layout";
import AppLayout from "@/layouts/app-layout";

interface Destination {
  id: number;
  name: string;
  category: string;
  location: string;
  price: number;
  rating_count: number;
  bookings: number;
  average_rating: number;
  description: string;
  status: string;
  duration: string;
  guests_max: number;
  guests_min: number;
  image: string;        
  created_at: string;
  updated_at: string;
  package_options: string;
  in_wishlist?: boolean;
}

interface PageProps {
  destination: Destination;
}

export default function TourDetails({destination}: PageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(destination.in_wishlist || false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { post, processing } = useForm({
    destination_id: destination.id,
  });
  
  const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

  // Show flash messages as toasts when component mounts or flash changes
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleWishlist = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    if (inWishlist) {
      // Remove from wishlist
      router.delete(route('tourist.wishlist.destroy', { destination: destination.id }), {
        preserveScroll: true,
        onSuccess: () => {
          setInWishlist(false);
          toast.success('Removed from wishlist');
        },
        onError: () => {
          toast.error('Failed to remove from wishlist');
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    } else {
      // Add to wishlist
      router.post(route('tourist.wishlist.store'), { destination_id: destination.id }, {
        preserveScroll: true,
        onSuccess: () => {
          setInWishlist(true);
          toast.success('Added to wishlist');
        },
        onError: () => {
          toast.error('Failed to add to wishlist');
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    }
  };

  const formatPrice = (price: number | string) => {
    return `₱${Number(price).toLocaleString('en-PH', {
      minimumFractionDigits: 0,
    })}`;
  };
  
  return (
    <>
    <Head title={`${destination.name} - Tour Details`} />
    <AppLayout breadcrumbs={[{ title: 'Tour Details', href: `/tourist/tours/${destination.id}` }]}>
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Link
            href={route('tourist.dashboard')}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Left section */}
          <div className="lg:col-span-2 space-y-8">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Share2 className="w-4 h-4 text-foreground" />
                  </Button>
                  <Button 
                    onClick={handleWishlist}
                    size="icon" 
                    variant="secondary" 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white relative"
                    disabled={isProcessing}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
                    />
                  </Button>
                </div>
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
                  <Badge className="bg-secondary text-secondary-foreground">{destination.category}</Badge>
                  <Badge variant="outline">{destination.package_options}</Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {destination.name}
                </h1>
                
                <div className="flex items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{destination.average_rating}</span>
                    <span>({destination.rating_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.location}</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: "Duration", value: destination.duration },
                  { icon: Users, label: "Max Guests", value: destination.guests_max },
                  { icon: Calendar, label: "Availability", value: "Daily" },
                  { icon: Shield, label: "Difficulty", value: destination.status}
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
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
         <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-foreground">{formatPrice(destination.price * 0.90)}</span>
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(destination.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  20% OFF
                </Badge>
              </div>
            </CardHeader>

               <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Meeting Point</p>
                    <p className="font-medium">{destination.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Meeting Time</p>
                    <p className="font-medium">8:00 AM</p>
                  </div>
                </div>
               <Separator />
                <div className="space-y-3">
                <Link href={route('tourist.tourBookings', { destination: destination.id })}>
                <Button className="w-full btn-ocean h-12 text-lg mb-4">
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
    </AppLayout>
        </>
  );
 
}