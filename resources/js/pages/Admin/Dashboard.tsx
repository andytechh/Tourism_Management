import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Building2, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  User,
  Menu,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin-Dashboard',
        href: route('admin.dashboard'), 
    },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "destinations", name: "Destinations", icon: MapPin },
    { id: "bookings", name: "Bookings", icon: Calendar },
    { id: "businesses", name: "Businesses", icon: Building2 },
    { id: "reports", name: "Reports", icon: BarChart3 },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  // Sample data for charts
  const monthlyVisitors = [
    { month: 'Jan', visitors: 2400, revenue: 120000 },
    { month: 'Feb', visitors: 1800, revenue: 98000 },
    { month: 'Mar', visitors: 3200, revenue: 180000 },
    { month: 'Apr', visitors: 2800, revenue: 160000 },
    { month: 'May', visitors: 3800, revenue: 220000 },
    { month: 'Jun', visitors: 4200, revenue: 250000 },
  ];

  const tourTypes = [
    { name: 'Whale Shark Tours', value: 45, color: '#3B82F6' },
    { name: 'Island Hopping', value: 25, color: '#10B981' },
    { name: 'Firefly Cruise', value: 20, color: '#F59E0B' },
    { name: 'Cultural Tours', value: 10, color: '#EF4444' },
  ];

  const stats = [
    {
      title: "Total Tourists",
      value: "15,847",
      change: "+12.5%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Active Bookings",
      value: "892",
      change: "+8.2%",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Registered Businesses",
      value: "156",
      change: "+15.3%",
      icon: Building2,
      color: "text-coral",
      bgColor: "bg-coral/10"
    },
    {
      title: "Monthly Revenue",
      value: "₱2.5M",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-primary-dark",
      bgColor: "bg-primary-dark/10"
    }
  ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
     {/* Main Content */}
      <div className="flex-1 flex flex-col">
         <header className="bg-card border-b border-border shadow-soft">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-card-foreground">
                Dashboard Overview
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-medium transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-card-foreground mt-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-secondary font-medium mt-1">
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Visitors Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Monthly Visitors</span>
                  </CardTitle>
                  <CardDescription>
                    Tourist arrivals over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyVisitors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="visitors" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tour Types Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-secondary" />
                    <span>Popular Tour Types</span>
                  </CardTitle>
                  <CardDescription>
                    Distribution of booked tour categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tourTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {tourTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-coral" />
                  <span>Revenue Trend</span>
                </CardTitle>
                <CardDescription>
                  Monthly revenue performance in Philippine Pesos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyVisitors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`₱${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--coral))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--coral))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        </div>
        </AppLayout>
    );
}
