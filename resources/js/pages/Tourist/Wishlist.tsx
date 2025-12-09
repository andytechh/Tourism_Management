import { useState, useEffect } from "react";
import { Heart, MapPin, Star, Calendar, Users, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { usePage, router, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{
    title: '',
    href: '/tourist/wishlist',
}];

interface WishlistItem {
  id: number;
  name: string;
  location: string;
  price: number;
  average_rating: number | null;
  rating_count: number;
  duration: string;
  guests_max: number;
  category: string;
  created_at: string;
  image: string; // Make sure this is always a string URL
}

export default function Wishlist() {
  const { wishlist = [] } = usePage().props as { wishlist: WishlistItem[] };
  const [items, setItems] = useState<WishlistItem[]>(wishlist);

  const removeFromWishlist = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    router.delete(
      route('tourist.wishlist.destroy', { destination: id }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Removed from wishlist');
        },
        onError: () => {
          // Revert optimistic update on error
          setItems(items);
          toast.error('Failed to remove from wishlist');
        }
      }
    );
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <>
     <Head title="Donsol Tourism Management System" />  
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {items.length} {items.length === 1 ? "tour" : "tours"} saved for later
          </p>
        </div>

        {/* Wishlist Grid */}
        {items.length === 0 ? (
          <Card className="border-2 animate-fade-in">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start adding tours you'd like to experience in the future!
              </p>
              <Button 
                size="lg" 
                className="hover:scale-105 transition-transform"
                onClick={() => router.visit(route('tourist.dashboard'))}
              >
                Explore Tours
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Card
                key={item.id}
                className="group border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  {/* ✅ FIXED: Proper image rendering */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default.jpg'; // Fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-accent-foreground">
                    {item.category}
                  </Badge>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      {item.average_rating ? (
                        <>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{item.average_rating}</span>
                          <span className="text-sm text-white/80">({item.rating_count} reviews)</span>
                        </>
                      ) : (
                        <span className="text-sm text-white/80">No reviews yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{item.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Max {item.guests_max}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(item.price)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Added {formatDate(item.created_at)}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 gap-2">
                  <Button 
                    className="flex-1 hover:scale-105 transition-transform"
                    onClick={() => router.visit(route('tourist.tourBookings', { destination: item.id }))}
                  >
                    Book Now
                  </Button>
                
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:scale-105 transition-transform"
                    onClick={() => router.visit(route('tourist.tourDetails', { destination: item.id }))}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </AppLayout>
      </>
  );
}