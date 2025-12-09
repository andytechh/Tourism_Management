import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  Eye,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";

// TYPES (match controller)

interface MonthlyReport {
  month: number;
  revenue: number;
  bookings: number;
}

interface DestinationReport {
  id: number;
  name: string;
  bookings: number;
  revenue: number;
}

interface DemographicReport {
  name: string;
  value: number;
}

interface BusinessReport {
  type: string;
  count: number;
  percentage: number;
}

interface ReportData {
  monthlyRevenue: MonthlyReport[];
  popularDestinations: DestinationReport[];
  customerDemographics: DemographicReport[];
  businessTypes: BusinessReport[];
  totalRevenue: number;
  totalVisitors: number;
  averageRating: number;
  repeatVisitors: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: '',
    href: route('admin.reports'),
  },
];
//export to CSV utility
const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const header = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
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

// MAIN COMPONENT

export default function Reports() {
  const { 
    monthlyRevenue = [], 
    popularDestinations = [], 
    customerDemographics = [], 
    businessTypes = [],
    totalRevenue = 0,
    totalVisitors = 0,
    averageRating = 0,
    repeatVisitors = 0
  } = usePage().props as unknown as ReportData;

  // Sorting state
  const [sortKey, setSortKey] = useState<keyof DestinationReport | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedDestinations = useMemo(() => {
    if (!sortKey) return popularDestinations;

    return [...popularDestinations].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    });
  }, [popularDestinations, sortKey, sortDirection]);

  const handleSort = (key: keyof DestinationReport) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (key: keyof DestinationReport) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDown className="w-3 h-3 ml-1 text-primary" />
      : <ArrowUpDown className="w-3 h-3 ml-1 text-primary rotate-180" />;
  };

  // FORMATTED DATA FOR CHARTS

  const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
    month: new Date(2025, item.month - 1).toLocaleString('en-US', { month: 'short' }),
    revenue: item.revenue,
    bookings: item.bookings,
  }));

  const formattedDemographics = customerDemographics.map((item, i) => ({
    ...item,
    color: ['#0EA5E9', '#10B981', '#F59E0B'][i] || '#6B7280'
  }));

  // EXPORT HANDLERS

  const exportRevenue = () => {
    const data = formattedMonthlyRevenue.map(m => ({
      Month: m.month,
      Revenue: m.revenue,
      Bookings: m.bookings
    }));
    exportToCSV(data, 'revenue_report');
  };

  const exportDestinations = () => {
    const data = popularDestinations.map(d => ({
      Destination: d.name,
      Bookings: d.bookings,
      Revenue: d.revenue
    }));
    exportToCSV(data, 'popular_destinations');
  };

  const exportAll = () => {
    const summary = [
      { Metric: "Total Revenue", Value: totalRevenue },
      { Metric: "Total Visitors", Value: totalVisitors },
      { Metric: "Average Rating", Value: averageRating },
      { Metric: "Repeat Visitors %", Value: repeatVisitors }
    ];
    exportToCSV(summary, 'tourism_summary_report');
  };

  return (
    <>
      <Head title="Donsol Tourism Management System" />

    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">Comprehensive insights into tourism performance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={exportAll}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign },
            { title: "Total Visitors", value: totalVisitors.toLocaleString(), icon: Users },
            { title: "Avg. Rating", value: averageRating.toFixed(1), icon: Star },
            { title: "Repeat Visitors", value: `${repeatVisitors}%`, icon: TrendingUp }
          ].map((stat, index) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="destinations">Popular Destinations</TabsTrigger>
              <TabsTrigger value="demographics">Customer Demographics</TabsTrigger>
              <TabsTrigger value="businesses">Business Overview</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportRevenue}>
                <Download className="w-3 h-3 mr-1" /> Revenue
              </Button>
              <Button variant="outline" size="sm" onClick={exportDestinations}>
                <Download className="w-3 h-3 mr-1" /> Destinations
              </Button>
            </div>
          </div>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                  <CardDescription>Revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedMonthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" tickFormatter={(value) => `₱${(value / 1000)}k`} />
                      <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, "Revenue"]} />
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
                    <BarChart data={formattedMonthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#10B981" radius={[4, 4, 0, 0]} />
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
                {sortedDestinations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No destination data available</p>
                ) : (
                  <div className="space-y-4">
                    {sortedDestinations.map((dest, index) => (
                      <div key={dest.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{dest.name}</div>
                            <div className="text-sm text-muted-foreground">{dest.bookings} bookings</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₱{dest.revenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSort('bookings')}
                  >
                    Sort by Bookings {getSortIcon('bookings')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSort('revenue')}
                  >
                    Sort by Revenue {getSortIcon('revenue')}
                  </Button>
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
                        data={formattedDemographics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {formattedDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {formattedDemographics.map((item) => (
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
                  <CardTitle>Business Distribution</CardTitle>
                  <CardDescription>Registered business types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessTypes.map((business) => (
                      <div key={business.type} className="flex items-center justify-between">
                        <span>{business.type}</span>
                        <div className="flex items-center gap-2 w-1/2">
                          <Progress value={business.percentage} className="h-2" />
                          <span className="text-sm w-10">{business.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
                <CardDescription>Registered tourism businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessTypes.map((business) => (
                    <div key={business.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {business.type === "Hotels" && <MapPin className="w-4 h-4 text-primary" />}
                          {business.type === "Restaurants" && <Users className="w-4 h-4 text-primary" />}
                          {business.type === "Tour Guides" && <Eye className="w-4 h-4 text-primary" />}
                          {business.type === "Transport" && <TrendingUp className="w-4 h-4 text-primary" />}
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
    </>
  );
}