import { useState } from "react";
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tourist-Trips',
    href: route('tourist.trips'),
  },
];

interface Booking {
  id: number;
  guests: number;
  booking_time: string;
  booking_date: string;
  status: string;
  image: string;
  name: string;
  destination: string;
  location: string;
  total_price: number;
  rating?: number;
  feedback?: string;
}

interface TripsProps {
  flash: {
    message?: string;
  };
  bookings: Booking[];
}

export default function Trips() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    rating: 0,
    feedback: '',
  });

  const handleRatingSubmit = () => {
    if (!selectedBooking) return;

    post(route('tourist.bookings.rate', selectedBooking.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setSelectedBooking(null);
        reset();
      },
    });
  };

  const { bookings = [], flash } = usePage().props as TripsProps;

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed": return "secondary";
      case "pending": return "default";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const completedBookings = bookings.filter(b => b.status === "confirmed");
  const upcomingBookings = bookings.filter(b => b.status === "pending");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-2 group">
      <div className="grid md:grid-cols-3 gap-0">
        <div className="relative h-35 md:h-full overflow-hidden">
          <img
            src={booking.image}
            alt={booking.destination}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge variant={getStatusVariant(booking.status)} className="absolute top-4 right-4 shadow-md backdrop-blur-sm text-sm font-bold">
            {booking.status.toUpperCase()}
          </Badge>
        </div>

        <CardContent className="md:col-span-2 p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {booking.destination}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-base">{booking.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-full bg-secondary/10">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-semibold">{booking.booking_time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-full bg-coral/10">
                  <User className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="font-semibold">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all">
                <div className="p-2 rounded-full bg-white/50 backdrop-blur-sm">
                  <span className="text-xl font-bold text-primary">₱</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Price</p>
                  <p className="text-xl font-bold text-primary">{booking.total_price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t-2 border-dashed">
              <div className="px-4 py-2 rounded-lg bg-accent/30">
                <p className="text-xs text-muted-foreground mb-1">Confirmation Code</p>
                <p className="font-mono font-bold text-primary text-sm">{booking.name}</p>
              </div>

              {booking.status === "confirmed" && (
                <div>
                  {booking.rating ? (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= booking.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setData('rating', booking.rating || 0);
                          setData('feedback', booking.feedback || '');
                        }}
                      >
                        Edit Rating
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setData('rating', 0);
                        setData('feedback', '');
                      }}
                    >
                      Rate Experience
                    </Button>
                  )}
                </div>
              )}
            </div>

            {booking.feedback && (
              <div className="pt-6 mt-6 border-t-2 border-dashed">
                <div className="p-4 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border-l-4 border-primary">
                  <p className="text-muted-foreground italic">"{booking.feedback}"</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your tour bookings</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed ({completedBookings.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {bookings.map(renderBookingCard)}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4 mt-6">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(renderBookingCard)
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Upcoming Bookings</CardTitle>
                      <CardDescription>You don't have any upcoming tours scheduled.</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4 mt-6">
                {completedBookings.length > 0 ? (
                  completedBookings.map(renderBookingCard)
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Completed Bookings</CardTitle>
                      <CardDescription>You haven't completed any tours yet.</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-4 mt-6">
                {cancelledBookings.length > 0 ? (
                  cancelledBookings.map(renderBookingCard)
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Cancelled Bookings</CardTitle>
                      <CardDescription>You don't have any cancelled bookings.</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        
        {selectedBooking && (
          <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedBooking(null);
              }
            }}
          >
            <div className="w-full max-w-md bg-background border rounded-lg shadow-lg p-6 animate-in fade-in zoom-in">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedBooking.rating ? "Edit Your Rating" : "Rate Your Experience"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    How was your {selectedBooking.destination} experience?
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setData('rating', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= data.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Your Review (Optional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with others..."
                    value={data.feedback}
                    onChange={(e) => setData('feedback', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRatingSubmit} 
                  disabled={data.rating === 0 || processing}
                >
                  {selectedBooking.rating ? "Update Rating" : "Submit Rating"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}