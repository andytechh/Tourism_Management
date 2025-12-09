import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect } from "react";
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
  Activity,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: '',
    href: route('admin.dashboard'), 
  },
];

interface DashboardStats {
  id: number;
}

interface Stats {
  touristCount: number;
  destinationCount: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface DashboardProps {
  flash: {
    message?: string
  },
  stats: Stats;
  monthlyVisitors: { month: number; visitors: number; revenue: number }[];
  tourTypes: { category: string, name: string; value: number; color?: string }[];
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  // ADD NOTIFICATION STATE
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { monthlyVisitors = [], tourTypes = [], flash, stats = {
    touristCount: 0,
    destinationCount: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  } } = usePage().props as Partial<DashboardProps>;

  //  FETCH NOTIFICATIONS ON MOUNT
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/admin/notifications');
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // GET ICON BASED ON NOTIFICATION TYPE
  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'booking':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const visitorsData = monthlyVisitors.map((item) => ({
    month: new Date(2024, item.month - 1).toLocaleString('default', { month: 'short' }),
    visitors: item.visitors,
    revenue: item.revenue,
  }));

  const tourTypeData = tourTypes.map((t) => ({
    name: t.category || 'Unknown',
    value: t.value,
    color: t.color || '#3B82F6', 
  }));

  return (
    <>
      <Head title="Donsol Tourism Management System" />

    <AppLayout breadcrumbs={breadcrumbs}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border shadow-soft">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
            </div>

            {/* NOTIFICATION DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-96 overflow-auto text-accent-foreground">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {notifications.length === 0 ? (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 ${!notif.read ? 'bg-accent' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-muted-foreground">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <DropdownMenuItem>
                  <Link href="/admin/notifications" className="w-full text-left">
                    View All Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-m font-medium">Total Tourists</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.touristCount}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-m font-medium">Active Bookings</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">71.5% of total</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-m font-medium">Active Destinations</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.destinationCount}</div>
                  <p className="text-xs text-muted-foreground">18.8% of total</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-m font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₱{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
            </motion.div>
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
                    <BarChart data={visitorsData}>
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
                        fill={'#5e83e6'} 
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
                        data={tourTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {tourTypeData.map((entry, index) => {
                          let color = '#3B82F6'; 
                          const category = entry.name.toLowerCase();

                          if (category.includes('marine') || category.includes('eco')) color = '#10B981'; 
                          else if (category.includes('whaleshark') || category.includes('diving')) color = '#3B82F6'; 
                          else if (category.includes('cultural') || category.includes('adventure')) color = '#F97316'; 
                          else if (category.includes('mountain')) color = '#FACC15'; 

                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
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
            <Card className='overflow-auto'>
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
                  <LineChart data={visitorsData}>
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
                      formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="coral" 
                      strokeWidth={3}
                      dot={{ fill: 'coral', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AppLayout>
        </>
  );
}