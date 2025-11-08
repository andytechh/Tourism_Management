import { useState } from "react";
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  id:number;
  guests:number;
  booking_time:number;
  booking_date:number;
  status:string;
  image:string;
  name:string;
  destination:string;
  location:string;
  total_price:number;
  rating?: number;
  feedback?: string;

}
interface TripsProps{
  flash:{
    message?:string
  },
  bookings:Booking[];
}

export default function Trips(){
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {data, setData, post, processing, errors, reset} = useForm({
    rating:0,
    feedback:'',
  });

  const handleRatingSubmit = () => {
    if (!selectedBooking) return;

    setData('rating', rating);
    setData('feedback', feedback);

    post(route('tourist.bookings.rate', selectedBooking.id), {
  preserveScroll: true,
  onSuccess: () => {
    setIsDialogOpen(false);
    reset();
    setRating(0);
    setFeedback('');
    setSelectedBooking(null);
  },
  onFinish: () => {
    window.location.reload();
  },
});

  };
  const {bookings = [], flash} = usePage().props as TripsProps;

 console.log(bookings);
 console.log(flash);
   const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "secondary";
      case "pending":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
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
                  {/* Always render the Dialog, but conditionally show stars + edit OR just the rate button */}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setRating(booking.rating || 0);
                              setFeedback(booking.feedback || "");
                              // Dialog will open via DialogTrigger
                            }}
                          >
                            Edit Rating
                          </Button>
                        </DialogTrigger>
                      </div>
                    ) : (
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setRating(0);
                            setFeedback("");
                            // Dialog will open via DialogTrigger
                          }}
                        >
                          Rate Experience
                        </Button>
                      </DialogTrigger>
                    )}

                    {/* Dialog Content — same for both new and edit */}
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          {booking.rating ? "Edit Your Rating" : "Rate Your Experience"}
                        </DialogTitle>
                        <DialogDescription>
                          How was your {booking.destination} experience?
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label>Your Rating</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= rating
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
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleRatingSubmit} disabled={rating === 0}>
                          {booking.rating ? "Update Rating" : "Submit Rating"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

          <Tabs defaultValue="all" className="w-full ">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">
                All ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6 h-30">
              {bookings.map(renderBookingCard)}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6 h-30">
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

            <TabsContent value="confirmed" className="space-y-4 mt-6 ">
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

            <TabsContent value="cancelled" className="space-y-4 mt-6 h-30">
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
    </div>
      </AppLayout>
  );
};

