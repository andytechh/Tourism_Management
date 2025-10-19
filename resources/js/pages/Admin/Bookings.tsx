import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Megaphone,
  CheckCircle2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { destroy } from '@/routes/profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Booking Management',
        href: route('admin.bookings'), 
    },
];

 interface Booking{
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
            message?:string
      },
     bookings: Booking[];
     stats: Stats;
  }
   
export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const {data, setData, post, put, delete: destroy, processing, errors} = useForm({
    status: '',
    payment_status: '',

  });
 
  const { bookings = [], flash, stats = {
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    cancelled_bookings: 0,
    total_revenue: 0,

  }} = usePage().props as BookingsProps;

 const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed": return "default";
    case "pending": return "secondary";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
};

  const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid": return "default";
    case "unpaid": return "secondary";
    case "refunded": return "outline";
    default: return "secondary";
  }
};


  const filteredBookings = bookings.filter(bookings => {
    const matchesSearch = bookings.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookings.tour_name.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && bookings.status.toLowerCase() === activeTab;
  });

    const handleConfirmBooking = (id: number) => {
    router.put(route('admin.bookings.update', { booking: id }), {
        status: 'confirmed',
        payment_status: 'paid'
      }, {
        preserveScroll: true,
      });
    };

    const handleCancelBooking = (id: number) => {
      toast.warning('Are you sure you want to cancel this booking?', {
        duration: 5000, // auto-dismiss after 5s
        position: 'top-center',
        action: {
          label: 'Confirm',
          onClick: () => {
            // Perform the cancellation
            router.put(
              route('admin.bookings.update', { booking: id }),
              {
                status: 'cancelled',
                payment_status: 'refunded',
              },
              {
                preserveScroll: true,
              }
            );
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {
          },
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
          destroy(route('admin.bookings.destroy', {booking: id }))
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          },
      },
    });
  };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <Alert className='bg-popover'>
            <CheckCircle2Icon />
            <AlertTitle>Errors! Check Inputs</AlertTitle>
            <AlertDescription>
              <ul>
                {Object.entries(errors).map(([key, message]) => (<li key={key}>{message as string}</li>) )}
              </ul>
            </AlertDescription>
          </Alert>
            )}
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground">Track and manage customer reservations</p>
        </div>
        <Button className="btn-ocean text-accent-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.confirmed_bookings}</div>
              <p className="text-xs text-muted-foreground">71.5% of total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending_bookings}</div>
              <p className="text-xs text-muted-foreground">18.8% of total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_revenue}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bookings Table */}
<Card>
    
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Bookings</CardTitle>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-[300px]"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
          <TableBody>
            {filteredBookings.map((bookings) => (
              
              <TableRow key={bookings.id} className='text-foreground-secondary hover:accent-foreground'>
                <TableCell className="font-medium">BK00{bookings.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{bookings.first_name+bookings.last_name}</div>
                    <div className="text-sm text-muted-foreground">{bookings.email}</div>
                  </div>
                </TableCell>
                <TableCell>{bookings.tour_name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{bookings.booking_date}</div>
                    <div className="text-sm text-muted-foreground">{bookings.booking_time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {bookings.guests}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{bookings.total_price}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(bookings.status)}>
                    {bookings.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusColor(bookings.payment_status)}>
                    {bookings.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className='text-accent-foreground'>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>

                      {bookings.status === 'cancelled' ? (
                        <>
                          <DropdownMenuItem disabled className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4 text-destructive" />
                            Already Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteCancelled(bookings.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Delete Booking
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem className='text-accent-foreground' onClick={() => handleConfirmBooking(bookings.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleCancelBooking(bookings.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
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
    );
}
