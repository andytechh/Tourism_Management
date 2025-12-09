import { useState, useEffect } from "react";
import { Head, Link } from '@inertiajs/react';
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
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import Swal from "sweetalert2";
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

// ====== NEW: Country Interface ======
interface Country {
  name: { common: string };
  cca2: string;
}

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
  guests_max: number;
  created_at: string;
  updated_at: string;
  duration: string;
}

interface PageProps {
  destination: Destination;
}

export default function BookingForm({ destination }: PageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [bookingType, setBookingType] = useState<"individual" | "package">("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // ====== NEW: Country State ======
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

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
    status: "pending",
    swimming: false,
    terms: false,
    newsletter: false,
    booking_type: bookingType,
    payment_method: paymentMethod,
  });

  // ====== Fetch Countries on Mount ======
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        const data: Country[] = await response.json();
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      } catch (err) {
        console.error('Failed to load countries:', err);
        // Optional: set fallback countries
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // ====== Auto-detect country from phone number ======
  useEffect(() => {
    if (!data.phone.trim()) return;

    const phoneNumber = parsePhoneNumberFromString(data.phone);
    if (phoneNumber && phoneNumber.country) {
      setData("nationality", phoneNumber.country);
    }
  }, [data.phone]);

  const formatPrice = (price: number | string) => {
    return `₱${Number(price).toLocaleString('en-PH', {
      minimumFractionDigits: 0,
    })}`;
  };

  // Mock tour data
  const tour = {
    duration: "3-4 hours",
    maxGuests: 8,
    meetingPoint: "Donsol Visitor Center",
    includes: ["Professional guide", "Snorkeling gear", "Underwater photos", "Safety briefing"]
  };

  const availableTimes = ["6:00 AM", "10:00 AM", "2:00 PM"];
  const totalGuests = adults + children;
  const isPackage = bookingType === "package";
  const subtotal = isPackage 
    ? destination.price 
    : (adults * (destination.price * 0.25) + children * (destination.price * 0.5 * 0.30));
  const total = subtotal;

  const handleContinue = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime || totalGuests === 0) {
        alert("Please select a date, time, and at least one guest.");
        return;
      }
      setData("booking_date", selectedDate.toISOString().split("T")[0]);
      setData("booking_time", selectedTime);
      setData("adults", adults);
      setData("children", children);
      setData("total_price", total);
      setData("booking_type", bookingType);
      setStep(2);
    } 
    else if (step === 2) {
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
      post(route('Tourist.bookings.store'), {
        preserveScroll: true,
        onSuccess: (page) => {
          Swal.fire({
            title: "Booking submitted! Please complete payment",
            icon: "success",
            draggable: true
          });
        },
        onError: (errors) => {
          console.error("Submission failed:", errors);
          toast.error('Failed to submit booking. Please check your details.');
        }
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
    <Head title="Donsol Tourism Management System" />
  
    <AppLayout breadcrumbs={breadcrumbs}>
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
          <div className="mb-8">
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
            <div className="lg:col-span-2">
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
                                !selectedDate && "text-accent-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 text-accent-foreground" align="start">
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

                      {/* Booking Type & Guests */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Select Booking Type</Label>
                        <RadioGroup
                          value={bookingType}
                          onValueChange={(value: "individual" | "package") => {
                            setBookingType(value);
                            if (value === "package") {
                              setAdults(destination.guests_max);
                              setChildren(0);
                            } else {
                              setAdults(1);
                              setChildren(0);
                            }
                          }}
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value="package" id="package" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="package" className="font-medium block">
                                Group Package
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                Fixed group size: {destination.guests_max} persons • {formatPrice(destination.price)} total
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value="individual" id="individual" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="individual" className="font-medium block">
                                Individual/Private
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatPrice(destination.price * 0.25)} per person
                              </p>
                              {bookingType === "individual" && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Adults</span>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        disabled={adults <= 1}
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center font-medium">{adults}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAdults(adults + 1)}
                                        disabled={adults + children >= 8}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Children (30% off)</span>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        disabled={children <= 0}
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center font-medium">{children}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setChildren(children + 1)}
                                        disabled={adults + children >= 8}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </RadioGroup>

                        {totalGuests >= 8 && bookingType === "individual" && (
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
                          <Label htmlFor="lastName">Last Name *</Label>
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
                          value={data.phone}
                          type="tel"
                          onChange={(e) => setData("phone", e.target.value)}
                          placeholder="e.g. +639123456789"
                        />
                        {data.nationality && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Detected country: {data.nationality} 
                            {(() => {
                              try {
                                return ` (+${getCountryCallingCode(data.nationality)})`;
                              } catch {
                                return '';
                              }
                            })()}
                          </p>
                        )}
                      </div>

                      {/* Dynamic Country Dropdown */}
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select 
                          value={data.nationality}
                          onValueChange={(value) => setData("nationality", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your nationality" />
                          </SelectTrigger>
                          <SelectContent className="text-accent-foreground">
                            {loadingCountries ? (
                              <SelectItem value="" disabled>Loading countries...</SelectItem>
                            ) : (
                              countries.map((country) => (
                                <SelectItem key={country.cca2} value={country.cca2}>
                                  {country.name.common}
                                </SelectItem>
                              ))
                            )}
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

                      {data.payment_method === "gcash" && (
                        <div className="mt-6 flex flex-col items-center">
                          <Label className="mb-2">Scan to Pay via GCash</Label>
                          <img src="/images/myqr.png" alt="GCash QR" className="h-40 w-40 object-contain" />
                        </div>
                      )}

                      {data.payment_method === "paymaya" && (
                        <div className="mt-6 flex flex-col items-center">
                          <Label className="mb-2">Scan to Pay via Maya</Label>
                          <img src="/images/mymaya.png" alt="Maya QR" className="h-40 w-40 object-contain" />
                        </div>
                      )}

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
                  <div className="flex gap-3">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{destination.name}</h4>
                      <p className="text-sm text-muted-foreground">{destination.duration}</p>
                    </div>
                  </div>

                  <Separator />

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

                  <div className="space-y-2 text-sm">
                    {isPackage ? (
                      <div className="flex justify-between">
                        <span>Group Package ({destination.guests_max} persons)</span>
                        <span>{formatPrice(destination.price)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Adults ({adults})</span>
                          <span>{formatPrice(adults * destination.price * 0.25)}</span>
                        </div>
                        {children > 0 && (
                          <div className="flex justify-between">
                            <span>Children ({children})</span>
                            <span>{formatPrice(children * destination.price * 0.5 * 0.3)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>₱{total.toLocaleString()}</span>
                    </div>
                  </div>

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
    </AppLayout>
   </>
  );
}