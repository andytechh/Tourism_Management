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
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    return date.toLocaleString();
  } catch {
    return date.toString();
  }
};

import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  
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
    swimming: false,
    terms: false,
    newsletter: false,
    payment_method: paymentMethod,
  });
  
  console.log(data);

  
  const formatPrice = (price: number | string) => {
  return `₱${Number(price).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
  })}`;
  };

  // Mock tour data
  const tour = {
    duration: "3-4 hours",
    maxGuests: 8,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
    meetingPoint: "Donsol Visitor Center",
    includes: ["Professional guide", "Snorkeling gear", "Underwater photos", "Safety briefing"]
  };

  const availableTimes = ["6:00 AM", "10:00 AM", "2:00 PM"];
  const totalGuests = adults + children;
  const subtotal = adults * destination.price + children * (destination.price * 0.5);
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

const handleContinue = () => {
  if (step === 1) {
    if (!selectedDate || !selectedTime || totalGuests === 0) {
      alert("Please select a date, time, and at least one guest.");
      return;
    }
    // Sync Step 1 data
    setData("booking_date", selectedDate.toISOString().split("T")[0]);
    setData("booking_time", selectedTime);
    setData("adults", adults);
    setData("children", children);
    setData("total_price", total);
    setStep(2);
  } 
  else if (step === 2) {
    // Validate required fields
    if (!data.first_name.trim()) {
      alert("Please enter your first name.");
      return;
    }
    if (!data.last_name.trim()) {
      alert("Please enter your last name.");
      return;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (!data.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    if (!data.swimming) {
      alert("Please confirm guests can swim.");
      return;
    }
    if (!data.terms) {
      alert("Please agree to the terms.");
      return;
    }
    setStep(3);
  } 
  else if (step === 3) {
    // Final submission
    post(route('Tourist.bookings.store'), {
      preserveScroll: true,
      onSuccess: (page) => {
        // Redirect or show success (optional)
        alert("Booking submitted! Please complete payment.");
      },
      onError: (errors) => {
        console.error("Submission failed:", errors);
        alert("Failed to submit booking. Please check your details.");
      }
    });
  }
};

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

   const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment successful! Booking completed.");
    }, 2000);
  };

  return (
<div className="min-h-screen bg-background">
  
  <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    {/* Breadcrumb */}
    <div className="py-6">
      <Link
        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors" 
        href={route('tourist.dashboard')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Cancel
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
              <Input className="mt-2" 
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="firstName">Last Name *</Label>
              <Input className="mt-2"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
                value={data.email} type="email"
                onChange={(e) => setData("email", e.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
              />

          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              value={data.phone} type="tel"
              onChange={(e) => setData("phone", e.target.value)}
              placeholder="Enter your Phone Number"
            />
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Select
                value={data.nationality}
                onValueChange={(value) => setData("nationality", value)}
              >
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
              value={data.special_requests}
              onChange={(e) => setData("special_requests", e.target.value)}
              placeholder="Any special requirements or requests..."
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
              id="swimming"
              checked={data.swimming}
              onCheckedChange={(checked) => setData("swimming", !!checked)}
            />
            <Label htmlFor="swimming" className="text-sm">
                I confirm that all guests are comfortable swimming in open water
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={data.terms}
                onCheckedChange={(checked) => setData("terms", !!checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions and cancellation policy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                  checked={data.newsletter}
                  onCheckedChange={(checked) => setData("newsletter", !!checked)}
                />
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
    <Card className="shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Choose Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={data.payment_method}
          onValueChange={(value) => setData("payment_method", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="gcash" id="gcash" />
            <Label htmlFor="gcash" className="flex items-center space-x-2 cursor-pointer">
              <img src="/images/gcash.png" alt="GCash" className="h-7 w-9" />
              <span>GCash</span>
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <RadioGroupItem value="paymaya" id="paymaya" />
            <Label htmlFor="paymaya" className="flex items-center space-x-2 cursor-pointer">
              <img src="/images/maya.png" alt="PayMaya" className="h-7 w-9" />
              <span>PayMaya</span>
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex items-center space-x-2 cursor-pointer">
              <span>Bank Transfer</span>
            </Label>
          </div>
        </RadioGroup>

        {/* GCash QR */}
        {data.payment_method === "gcash" && (
          <div className="mt-6 flex flex-col items-center">
            <Label className="mb-2">Scan to Pay via GCash</Label>
            <img src="/images/myqr.png" alt="GCash QR" className="h-100 w-100 object-contain" />
          </div>
        )}

        {/* PayMaya QR */}
        {data.payment_method === "paymaya" && (
          <div className="mt-6 flex flex-col items-center">
            <Label className="mb-2">Scan to Pay via Maya</Label>
            <img src="/images/mymaya.png" alt="Maya QR" className="h-100 w-100 object-contain" />
          </div>
        )}

        {/* Bank Info */}
        {data.payment_method === "bank" && (
          <div className="mt-4 p-4 bg-muted/30 rounded-md">
            <p className="text-sm">
              <strong>Bank Transfer Details:</strong><br />
              Bank: BDO<br />
              Account Name: Whale Shark Tours Inc.<br />
              Account Number: 1234 5678 90
            </p>
          </div>
        )}
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
          disabled={processing || (step === 1 && (!selectedDate || !selectedTime || totalGuests === 0))}
          className="px-8 btn-ocean"
        >
          {step === 3 ? "Submit Booking" : "Continue"}
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
