import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React, { useState } from "react";
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
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Booking Management',
        href: route('admin.bookings'), 
    },
];

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

   const bookings = [
    {
      id: "BK001",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      tourName: "Whale Shark Interaction",
      date: "2024-03-15",
      time: "6:00 AM",
      guests: 2,
      totalAmount: "₱3,000",
      status: "Confirmed",
      paymentStatus: "Paid",
      bookingDate: "2024-03-01"
    },
    {
      id: "BK002",
      customerName: "Marco Rodriguez",
      customerEmail: "marco@example.com",
      tourName: "Firefly Watching",
      date: "2024-03-16",
      time: "7:00 PM",
      guests: 4,
      totalAmount: "₱3,200",
      status: "Pending",
      paymentStatus: "Pending",
      bookingDate: "2024-03-02"
    },
    {
      id: "BK003",
      customerName: "Yuki Tanaka",
      customerEmail: "yuki@example.com",
      tourName: "Island Hopping",
      date: "2024-03-18",
      time: "8:00 AM",
      guests: 6,
      totalAmount: "₱13,200",
      status: "Confirmed",
      paymentStatus: "Paid",
      bookingDate: "2024-03-03"
    },
    {
      id: "BK004",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      tourName: "Whale Shark Interaction",
      date: "2024-03-10",
      time: "6:00 AM",
      guests: 3,
      totalAmount: "₱4,500",
      status: "Cancelled",
      paymentStatus: "Refunded",
      bookingDate: "2024-02-28"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "default";
      case "Pending": return "secondary";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "default";
      case "Pending": return "secondary";
      case "Refunded": return "outline";
      default: return "secondary";
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status.toLowerCase() === activeTab;
  });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground">Track and manage customer reservations</p>
        </div>
        <Button className="btn-ocean">
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
              <div className="text-2xl font-bold">1,247</div>
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
              <div className="text-2xl font-bold text-emerald-600">892</div>
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
              <div className="text-2xl font-bold text-amber-600">234</div>
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
              <div className="text-2xl font-bold">₱1.2M</div>
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
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.tourName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.date}</div>
                          <div className="text-sm text-muted-foreground">{booking.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {booking.guests}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{booking.totalAmount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
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
