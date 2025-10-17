import { useState } from "react";
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useForm } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";


const format = (date?: Date, pattern?: string): string => {
  if (!date) return "";
  try {
    if (pattern === "PPP") {
      return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    }
    if (pattern === "MMM dd, yyyy") {
      return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    }
    // fallback for other patterns
    return date.toLocaleString();
  } catch {
    return date.toString();
  }
};

import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tours Details',
        href: route('Tourist.bookings.store', { destination: 1 }),
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

export default function BookingForm({destination}: PageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [step, setStep] = useState(1);
  const { data, setData, post, processing, errors } = useForm({
    destination_id: destination.id,
    booking_date: "",
    booking_time: "",
    adults: adults,
    children: children,
    total_price: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    special_requests: "",
  });

  
  const formatPrice = (price: number | string) => {
  return `₱${Number(price).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
  })}`;
  };

  // Mock tour data
  const tour = {
    id: 1,
    title: "Whale Shark Interaction Experience",
    price: 1500,
    duration: "3-4 hours",
    maxGuests: 8,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
    meetingPoint: "Donsol Visitor Center",
    includes: ["Professional guide", "Snorkeling gear", "Underwater photos", "Safety briefing"]
  };

  const availableTimes = ["6:00 AM", "10:00 AM", "2:00 PM"];
  const totalGuests = adults + children;
  const subtotal = adults * tour.price + children * (tour.price * 0.5);
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleContinue = () => {
  if (step < 3) {
    setStep(step + 1);
  } else {
    post(route('Tourist.bookings.store'), {
      onSuccess: () => alert("Booking successfully created!"),
    });
  }
};


  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
     
      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors" 
            href={route('tourist.tourDetails', { destination: tour.id })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tour Details
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 ">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto px-4 lg:px-0 ml-10">
            {[
              { step: 1, title: "Select Date & Guests" },
              { step: 2, title: "Your Information" },
              { step: 3, title: "Payment & Confirmation" }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step >= item.step 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {step > item.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{item.title}</span>
                {item.step < 3 && (
                  <div className={cn(
                    "w-16 h-0.5 ml-4",
                    step > item.step ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 ">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step 1: Date & Guests */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Number of Guests</CardTitle>
                    <CardDescription>
                      Choose your preferred date and time for the tour
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-12",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select Time</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className="h-12"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Guest Selection */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Number of Guests</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Adults</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(destination.price)} per person</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              disabled={adults <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setAdults(Math.min(8, adults + 1))}
                              disabled={totalGuests >= 8}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Children (8-17 years)</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(destination.price * 0.5).toLocaleString()} per child</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              disabled={children <= 0}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setChildren(Math.min(8 - adults, children + 1))}
                              disabled={totalGuests >= 8}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      {totalGuests >= 8 && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <p className="text-sm text-amber-700">Maximum group size is 8 people</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Guest Information */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                      Please provide your contact details for the booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Enter your first name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Enter your last name" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="philippines">Philippines</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="japan">Japan</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea 
                        id="specialRequests" 
                        placeholder="Any special requirements or requests..."
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="swimming" />
                        <Label htmlFor="swimming" className="text-sm">
                          I confirm that all guests are comfortable swimming in open water
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the terms and conditions and cancellation policy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" />
                        <Label htmlFor="newsletter" className="text-sm">
                          Subscribe to newsletter for tour updates and special offers
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Secure payment processing with SSL encryption
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-700">Your payment information is secure and encrypted</p>
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input id="cardName" placeholder="Enter name as on card" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="billingAddress">Billing Address *</Label>
                      <Textarea 
                        id="billingAddress" 
                        placeholder="Enter your billing address..."
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="saveCard" />
                      <Label htmlFor="saveCard" className="text-sm">
                        Save this card for future bookings (optional)
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-8"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!selectedDate || !selectedTime || totalGuests === 0}
                  className="px-8 btn-ocean"
                >
                  {step === 3 ? "Complete Booking" : "Continue"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tour Info */}
                <div className="flex gap-3">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{destination.name}</h4>
                    <p className="text-sm text-muted-foreground">{tour.duration}</p>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{selectedTime || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span>{totalGuests} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meeting Point:</span>
                    <span className="text-right">{tour.meetingPoint}</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Adults ({adults})</span>
                    <span>{formatPrice(adults * destination.price).toLocaleString()}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between">
                      <span>Children ({children})</span>
                      <span>{formatPrice(children * destination.price * 0.5).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>₱{serviceFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>₱{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Includes */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Includes:</h4>
                  <ul className="space-y-1">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cancellation Policy */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Free cancellation</strong> up to 24 hours before the tour starts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
