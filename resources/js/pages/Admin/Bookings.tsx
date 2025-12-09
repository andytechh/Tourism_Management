import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  CheckCircle2Icon,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Megaphone,
  MoreHorizontal,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: '',
    href: route('admin.bookings'),
  },
];

interface Booking {
  id: number;
  tourist_id: number;
  destination_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string;
  special_requests: string;
  payment_method: string;
  payment_status: string;
  tour_name: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  totalAmount: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
}

interface BookingsProps {
  flash: {
    message?: string;
  };
  bookings: Booking[];
  stats: Stats;
}


const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const header = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.values(row)
      .map((val) =>
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val,
      )
      .join(','),
  );
  const csv = [header, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewBooking, setViewBooking] = useState<Booking | null>(null); 

  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    status: '',
    payment_status: '',
  });

  const {
    bookings = [],
    flash,
    stats = {
      total_bookings: 0,
      pending_bookings: 0,
      confirmed_bookings: 0,
      cancelled_bookings: 0,
      total_revenue: 0,
    },
  } = usePage().props as BookingsProps;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'default';
      case 'unpaid':
        return 'secondary';
      case 'refunded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.tour_name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && booking.status.toLowerCase() === activeTab;
  });

  // Export to CSV
  const handleExport = () => {
    const data = filteredBookings.map((b) => ({
      'Booking ID': `BK00${b.id}`,
      'Customer Name': `${b.first_name} ${b.last_name}`,
      Email: b.email,
      Phone: b.phone,
      Tour: b.tour_name,
      Date: b.booking_date,
      Time: b.booking_time,
      Guests: b.guests,
      Amount: b.total_price,
      Status: b.status,
      'Payment Status': b.payment_status,
      Nationality: b.nationality,
      'Special Requests': b.special_requests,
    }));
    exportToCSV(data, 'bookings_report');
  };

  const handleConfirmBooking = (id: number) => {
    router.put(
      route('admin.bookings.update', { booking: id }),
      {
        status: 'confirmed',
      },
      {
        preserveScroll: true,
      },
    );
    toast.success('Booking confirmed successfully!');
  };

  const handleConfirmPayment = (id: number) => {
    router.put(
      route('admin.bookings.update', { booking: id }),
      {
        payment_status: 'paid',
      },
      {
        preserveScroll: true,
      },
    );
    toast.success('Payment confirmed for booking ID BK00' + id);
  };

  const handleCancelBooking = (id: number) => {
    toast.warning('Are you sure you want to cancel this booking?', {
      duration: 5000,
      position: 'top-center',
      action: {
        label: 'Confirm',
        onClick: () => {
          router.put(
            route('admin.bookings.update', { booking: id }),
            {
              status: 'cancelled',
              payment_status: 'refunded',
            },
            {
              preserveScroll: true,
            },
          );
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { },
      },
    });
  };

  const handleDeleteCancelled = (id: number) => {
    toast.warning('Permanently delete this booking?', {
      duration: 6000,
      position: 'top-center',
      action: {
        label: 'Delete',
        onClick: () => {
          destroy(route('admin.bookings.destroy', { booking: id }));
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { },
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
       <Head title="Donsol Tourism Management System" />
 
<AppLayout breadcrumbs={breadcrumbs}>
<div className="space-y-6 p-6">
<div className="flex items-center justify-between text-accent-foreground">
  <div>
    <div>
      {flash.message && (
        <Alert>
          <Megaphone />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            {flash.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
    {Object.keys(errors).length > 0 && (
      <Alert className="bg-popover">
        <CheckCircle2Icon />
        <AlertTitle>Errors! Check Inputs</AlertTitle>
        <AlertDescription>
          <ul>
            {Object.entries(errors).map(
              ([key, message]) => (
                <li key={key}>
                  {message as string}
                </li>
              ),
            )}
          </ul>
        </AlertDescription>
      </Alert>
    )}
    <h1 className="mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
      Manage Bookings
    </h1>
    <p className="text-muted-foreground">
      Track and manage customer reservations
    </p>
  </div>
  <Button
    className="text-accent-foreground"
    onClick={handleExport}
  >
    <Download className="mr-2 h-4 w-4 text-white" />
    Export Report
  </Button>
</div>

{/* Stats Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Bookings
        </CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {stats.total_bookings}
        </div>
        <p className="text-xs text-muted-foreground">
          +12% from last month
        </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Confirmed
        </CardTitle>
        <CheckCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-emerald-600">
          {stats.confirmed_bookings}
        </div>
        <p className="text-xs text-muted-foreground">
          71.5% of total
        </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Pending
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-amber-600">
          {stats.pending_bookings}
        </div>
        <p className="text-xs text-muted-foreground">
          18.8% of total
        </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Revenue
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ₱{stats.total_revenue.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          +18% from last month
        </p>
      </CardContent>
    </Card>
  </motion.div>
</div>

{/* VIEW BOOKING DETAILS DIALOG */}

<Dialog
  open={!!viewBooking}
  onOpenChange={() => setViewBooking(null)}
>
  <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto border-2 bg-background/95 backdrop-blur-sm">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Booking Details
      </DialogTitle>
      <DialogDescription>
        Full information for booking BK00
        {viewBooking?.id}
      </DialogDescription>
    </DialogHeader>

    {viewBooking && (
      <div className="space-y-6 py-4">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">
                Full Name
              </Label>
              <p className="font-medium">
                {viewBooking.first_name}{' '}
                {viewBooking.last_name}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Email
              </Label>
              <p className="font-medium">
                {viewBooking.email}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Phone
              </Label>
              <p className="font-medium">
                {viewBooking.phone}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Nationality
              </Label>
              <p className="font-medium">
                {viewBooking.nationality}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Info */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">
                Tour Name
              </Label>
              <p className="font-medium">
                {viewBooking.tour_name}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Booking Date
              </Label>
              <p className="font-medium">
                {viewBooking.booking_date}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Booking Time
              </Label>
              <p className="font-medium">
                {viewBooking.booking_time}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Guests
              </Label>
              <p className="font-medium">
                {viewBooking.guests}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Total Amount
              </Label>
              <p className="font-medium">
                ₱
                {viewBooking.total_price.toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Payment Method
              </Label>
              <p className="font-medium">
                {viewBooking.payment_method}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground space-x-1">
                Booking Status :
              </Label> 
              <Badge
                variant={getStatusColor(
                  viewBooking.status,
                )}
              >
                {viewBooking.status}
              </Badge>
            </div>
            <div>
              <Label className="text-muted-foreground ">
                Payment Status :
              </Label>
              <Badge
                variant={getPaymentStatusColor(
                  viewBooking.payment_status,
                )}
              >
                {viewBooking.payment_status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        {viewBooking.special_requests && (
          <Card>
            <CardHeader>
              <CardTitle>
                Special Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {viewBooking.special_requests}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground">
                Created
              </Label>
              <p>
                {formatDate(
                  viewBooking.created_at,
                )}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Updated
              </Label>
              <p>
                {formatDate(
                  viewBooking.updated_at,
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )}

    <DialogFooter>
      <Button onClick={() => setViewBooking(null)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  {/* Bookings Table */}
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Bookings</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-[300px] pl-10"
            />
          </div>
        </div>
      </div>
    </CardHeader>
<CardContent>
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="confirmed">
      Confirmed
    </TabsTrigger>
    <TabsTrigger value="pending">
      Pending
    </TabsTrigger>
    <TabsTrigger value="cancelled">
      Cancelled
    </TabsTrigger>
  </TabsList>
  <TabsContent value={activeTab} className="mt-6">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Tour</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Guests</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-accent-foreground">
        {filteredBookings.map((booking) => (
          <TableRow
            key={booking.id}
            className="text-accent-foreground hover:accent-foreground"
          >
            <TableCell className="font-medium">
              BK00{booking.id}
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {booking.first_name}{' '}
                  {booking.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {booking.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {booking.tour_name}
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {
                    booking.booking_date
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {
                    booking.booking_time
                  }
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {booking.guests}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              ₱
              {booking.total_price.toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge
                variant={getStatusColor(
                  booking.status,
                )}
              >
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={getPaymentStatusColor(
                  booking.payment_status,
                )}
              >
                {booking.payment_status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                >
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-accent-foreground"
                    onClick={() =>
                      setViewBooking(
                        booking,
                      )
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>

                  {booking.status ===
                    'cancelled' ? (
                    <>
                      <DropdownMenuItem
                        disabled
                        className="text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4 text-destructive" />
                        Already
                        Cancelled
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          handleDeleteCancelled(
                            booking.id,
                          )
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Delete
                        Booking
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="text-accent-foreground"
                        onClick={() =>
                          handleConfirmBooking(
                            booking.id,
                          )
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm
                        Booking
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-accent-foreground"
                        onClick={() =>
                          handleConfirmPayment(
                            booking.id,
                          )
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm
                        Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          handleCancelBooking(
                            booking.id,
                          )
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                        Booking
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TabsContent>
</Tabs>
</CardContent>
  </Card>
</div>
</AppLayout>
   </>
  );
}
