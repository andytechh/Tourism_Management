import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: route('admin.reports'), 
    },
];

export default function Reports() {
   const monthlyRevenue = [
    { month: "Jan", revenue: 85000, bookings: 120 },
    { month: "Feb", revenue: 92000, bookings: 135 },
    { month: "Mar", revenue: 108000, bookings: 158 },
    { month: "Apr", revenue: 125000, bookings: 180 },
    { month: "May", revenue: 142000, bookings: 205 },
    { month: "Jun", revenue: 138000, bookings: 198 }
  ];

  const popularDestinations = [
    { name: "Whale Shark Interaction", bookings: 485, revenue: 727500 },
    { name: "Firefly Watching", bookings: 312, revenue: 249600 },
    { name: "Island Hopping", bookings: 198, revenue: 435600 },
    { name: "Mangrove Tour", bookings: 156, revenue: 156000 },
    { name: "Cultural Heritage Tour", bookings: 89, revenue: 133500 }
  ];

  const customerDemographics = [
    { name: "Local", value: 35, color: "#0EA5E9" },
    { name: "Domestic", value: 45, color: "#10B981" },
    { name: "International", value: 20, color: "#F59E0B" }
  ];

  const businessTypes = [
    { type: "Hotels", count: 45, percentage: 36 },
    { type: "Restaurants", count: 38, percentage: 31 },
    { type: "Tour Guides", count: 28, percentage: 23 },
    { type: "Transport", count: 13, percentage: 10 }
  ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into tourism performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="btn-ocean">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱1.42M</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repeat Visitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="destinations">Popular Destinations</TabsTrigger>
          <TabsTrigger value="demographics">Customer Demographics</TabsTrigger>
          <TabsTrigger value="businesses">Business Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Number of bookings per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Destinations</CardTitle>
              <CardDescription>Most booked tours and experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDestinations.map((destination, index) => (
                  <div key={destination.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-ocean-light flex items-center justify-center text-sm font-bold text-ocean">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{destination.name}</div>
                        <div className="text-sm text-muted-foreground">{destination.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₱{destination.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Breakdown of visitor origins</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerDemographics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {customerDemographics.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>Visitor patterns throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Peak Season (Nov-Feb)</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">High Season (Mar-May)</span>
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Off Season (Jun-Oct)</span>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Businesses</CardTitle>
              <CardDescription>Business partner distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessTypes.map((business) => (
                  <div key={business.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-ocean-light">
                        {business.type === "Hotels" && <MapPin className="w-4 h-4 text-ocean" />}
                        {business.type === "Restaurants" && <Users className="w-4 h-4 text-ocean" />}
                        {business.type === "Tour Guides" && <Eye className="w-4 h-4 text-ocean" />}
                        {business.type === "Transport" && <TrendingUp className="w-4 h-4 text-ocean" />}
                      </div>
                      <div>
                        <div className="font-medium">{business.type}</div>
                        <div className="text-sm text-muted-foreground">{business.count} registered</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Progress value={business.percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{business.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
        </AppLayout>
    );
}
