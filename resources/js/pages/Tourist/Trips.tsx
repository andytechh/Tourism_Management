import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BreadcrumbItem } from "@/types";
import { route } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tourist-Trips',
        href: route('tourist.trips'),
    },
];


interface Booking {
  id: string;
  destination: string;
  location: string;
  image: string;
  date: string;
  time: string;
  guests: number;
  status: "completed" | "upcoming" | "cancelled";
  price: number;
  confirmationCode: string;
  userRating?: number;
  userReview?: string;
}

const Trips = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      destination: "Whale Shark Interaction",
      location: "Donsol, Sorsogon",
      image: "/placeholder.svg",
      date: "2024-01-15",
      time: "06:00 AM",
      guests: 2,
      status: "completed",
      price: 3500,
      confirmationCode: "WS-2024-001",
      userRating: 5,
      userReview: "Amazing experience! The whale sharks were incredible."
    },
    {
      id: "2",
      destination: "Firefly Watching Tour",
      location: "Donsol River",
      image: "/placeholder.svg",
      date: "2024-02-20",
      time: "07:00 PM",
      guests: 4,
      status: "completed",
      price: 1200,
      confirmationCode: "FF-2024-002",
    },
    {
      id: "3",
      destination: "Island Hopping Adventure",
      location: "Nearby Islands",
      image: "/placeholder.svg",
      date: "2024-12-25",
      time: "08:00 AM",
      guests: 3,
      status: "upcoming",
      price: 2500,
      confirmationCode: "IH-2024-003",
    },
    {
      id: "4",
      destination: "Snorkeling Experience",
      location: "Coral Reef Area",
      image: "/placeholder.svg",
      date: "2024-01-10",
      time: "09:00 AM",
      guests: 2,
      status: "cancelled",
      price: 1800,
      confirmationCode: "SN-2024-004",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRatingSubmit = () => {
    console.log("Rating submitted:", { bookingId: selectedBooking?.id, rating, review });
    setIsDialogOpen(false);
    setRating(0);
    setReview("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const completedBookings = bookings.filter(b => b.status === "completed");
  const upcomingBookings = bookings.filter(b => b.status === "upcoming");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid md:grid-cols-3 gap-0">
        <div className="relative h-48 md:h-full">
          <img
            src={booking.image}
            alt={booking.destination}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <Badge className={`absolute top-4 right-4 ${getStatusColor(booking.status)}`}>
            {booking.status}
          </Badge>
        </div>
        
        <CardContent className="md:col-span-2 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{booking.destination}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>{booking.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="font-semibold">
                ₱{booking.price.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Confirmation: <span className="font-mono font-medium">{booking.confirmationCode}</span>
              </div>
              
              {booking.status === "completed" && (
                <div>
                  {booking.userRating ? (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= booking.userRating!
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
                          setRating(booking.userRating || 0);
                          setReview(booking.userReview || "");
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit Rating
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={isDialogOpen && selectedBooking?.id === booking.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedBooking(booking);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Rate Experience
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Rate Your Experience</DialogTitle>
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
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleRatingSubmit} disabled={rating === 0}>
                            Submit Rating
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>

            {booking.userReview && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground italic">"{booking.userReview}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your tour bookings</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">
                All ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {bookings.map(renderBookingCard)}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4 mt-6">
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

            <TabsContent value="completed" className="space-y-4 mt-6">
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
    </div>
  );
};

export default Trips;
