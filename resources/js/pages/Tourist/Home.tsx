import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from '@inertiajs/react';
import { Calendar, Clock, Clock3, Filter, Locate, MapPin, Search, Star, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tourist-Dashboard',
        href: route('tourist.dashboard'),
    },
];

interface Destinations{
    id: number;
    name: string;
    category: string;
    location: string;
    price: number;
    average_rating: number;
    bookings: number;
    description: string;
    status: string;
    image: string;        
    created_at: string;
    guests_max: number;
    duration: number;
    updated_at: string;
    rating_count: number;
  }
interface PageProps {
  flash: {
    message?: string;
  };

    destinations : Destinations[];
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const {destinations =[], flash } = usePage().props as PageProps;
  
 console.log(destinations); 
  const categories = [
    { id: "all", name: "All Tours" },
    { id: "whaleshark", name: "Whale Shark" },
    { id: "nature", name: "Nature Experience" },
    { id: "cultural", name: "Cultural" },
    { id: "adventure", name: "Adventure" },
    { id: "marine", name: "Marine Aventure" }
  ];

  const formatPrice = (price: number | string) => {
  return `₱${Number(price).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
  })}`;
};

const handleLoadMore = () => {
  setVisibleCount((prev) => prev + 6);
}
const filteredDestinations = destinations.filter((dest) => {
  const matchesSearch =
    dest.name.toLowerCase().includes(search.toLowerCase()) ||
    dest.location.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    selectedCategory === "all" || dest.category === selectedCategory;

  const matchesStatus =
    statusFilter === "all" || dest.status.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesCategory && matchesStatus;
});
 const visibleDestinations = filteredDestinations.slice(0, visibleCount);
  

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
   <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}Amazing Tours
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Book unforgettable experiences in Donsol, from swimming with whale sharks to exploring pristine islands.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <div className="flex flex-col lg:flex-row gap-4 overflow-x-scroll lg:overflow-x-visible">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                placeholder="Search tours, activities..."
                className="pl-10 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              <Button size="lg" className="lg:px-8">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="section-padding px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 py-4">
            <h2 className="text-2xl font-bold text-foreground">
               {destinations.length} Destinations Found 
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Price: Low to High</Button>
              <Button variant="outline" size="sm">Rating</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 4 * 0.1 }}
              >
                <Card className="group hover:shadow-large transition-all duration-300 cursor-pointer overflow-hidden top-0 h-full">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-50 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="font-bold text-primary">{formatPrice(destination.price)}</span>
                    </div>
                    <Badge 
                      className="absolute top-4 left-4 bg-secondary text-secondary-foreground"
                    >
                      {/* {tour.difficulty} */}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {destination.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{destination.average_rating}</span>
                        <span className="text-xs text-muted-foreground">({destination.rating_count})</span>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {destination.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 ">
                    <div className="w-full grid grid-cols-3 gap-6 mb-4 text-sm text-muted-foreground text-center">
                      <div className="flex items-center">
                        <Clock3 className="w-4 h-4 mr-1" />
                         {destination.duration} 
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Max {destination.guests_max} Guests
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {destination.status}
                      </div>
                    </div>

                    <div className=" items-center flex justify-between space-x-2">

                      <div className="flex-1" >
                     <Link href={route('tourist.tourDetails', destination.id)} >
                          <Button className="btn-ocean flex-1">
                            View Details
                          </Button> 
                        </Link>
                      </div>
                      <div className="flex-1 flex justify-end">
                       <Link href={route('tourist.tourBookings', {destination: destination.id})} className="ml-2"> 
                        <Button variant="outline">
                          Book Now
                        </Button>
                      </Link> 
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
      {visibleCount < filteredDestinations.length && (
      <div className="text-center mt-12 mb-8">
        <Button size="lg" variant="outline" className="px-8" onClick={handleLoadMore}>
          Load More Tours
        </Button>
      </div>
    )}
  </div>
      </section>
    </div>
        </AppLayout>
    );
}
