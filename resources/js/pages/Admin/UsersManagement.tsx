import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
 import { Head, router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MoreHorizontal, Plus, Search, Users, UserCheck, UserX, Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'sonner';
import Swal from 'sweetalert2';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: route('admin.users'), 
    },
];
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login_at?: string;
  joinDate: string;
  avatar: string;
  created_at: string;
  bookings_count?: number;
}


interface Booking{
    id: number;
    destination_id:number;
}
interface Stats{
    $tourist: number;
}
interface UsersProps{
      flash:{
        message?:string;
      }
    booking: Booking[];
    stats: Stats;
    tourist_all: User[];

}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {data, setData, post, put, delete: destroy, processing, errors} = useForm({
    id: '',
    name: '',
    email: '',
    role: '',
  });

  const { booking = [], tourist_all = [], flash, stats = { $tourist: 0 } } =
  usePage().props as UsersProps;

  const getInitials = useInitials();
  dayjs.extend(relativeTime);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "staff": return "secondary";
      case "tourist": return "default";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "suspended": return "destructive";
      case "inactive": return "outline";
      default: return "outline";
    }
  };

const filteredUsers = tourist_all.filter(user => {
  const matchesSearch =
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesTab =
    activeTab === "all" || user.role === activeTab || user.status === activeTab;

  return matchesSearch && matchesTab;
});
  
  const userStats = {
    total: tourist_all.length,
    stats: stats,
    active: tourist_all.filter(u => u.status === "active").length,
    admins: tourist_all.filter(u => u.role === "admin").length,
    staff: tourist_all.filter(u => u.role === "staff").length
  };
  const handleResetPassword = async (id: number) => {
    Swal.fire({
    title: "Reset Password?",
    text: "This will generate a new random password for the user and send it via email.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reset it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      router.put(route("admin.users.reset-password", { id }));
      Swal.fire("Success!", "Password has been reset and emailed to the user.", "success");
    }
  });
 };
  const handleToggleStatus = async (id: number, newStatus: string) => {
    Swal.fire({
      title: newStatus === "active" ? "Activate User?" : "Suspend User?",
      text:
        newStatus === "active"
          ? "This will activate the user’s account."
          : "This will suspend the user’s account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: newStatus === "active" ? "Yes, activate" : "Yes, suspend",
    }).then((result) => {
      if (result.isConfirmed) {
        router.put(route("admin.users.toggle-status", { id }), { status: newStatus });
        Swal.fire(
          "Updated!",
          `User has been ${newStatus === "active" ? "activated" : "suspended"}.`,
          "success"
        );
      }
    });
  };


  const handleUserDelete = (id: number) => {
   Swal.fire({
       title: "Are you sure?",
       text: "This action cannot be undone.",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "Yes, delete it!",
       cancelButtonText: "Cancel",
     }).then((result) => {
       if (result.isConfirmed) {
         destroy(route("admin.users.destroy", id));
         Swal.fire("Deleted!", "The record has been deleted.", "success");
       }
     }) 
    }

return (
<AppLayout breadcrumbs={breadcrumbs}>
  <div className="container mx-auto p-6 space-y-8 min-h-screen">
<motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  >
<div>
  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
    User Management
  </h1>
  <p className="text-muted-foreground text-lg">Manage users, roles, and permissions</p>
</div>
<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
  <DialogTrigger asChild>
    <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
      <Plus className="mr-2 h-5 w-5" />
      Add User
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px] backdrop-blur-xl bg-background/95 border-2">
    <DialogHeader>
      <DialogTitle className="text-2xl">Add New User</DialogTitle>
      <DialogDescription>Create a new user account with appropriate role and permissions.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter full name" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="user@example.com" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">User Role</Label>
        <Select>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" size="lg" className="w-full sm:w-auto">Create User</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</motion.div>

{/* Stats Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.1 }}
  whileHover={{ y: -4 }}
>
  <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-primary/5 via-background to-background">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-muted-foreground">Total Users</CardTitle>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Users className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {userStats.total}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
    </CardContent>
  </Card>
</motion.div>

<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.2 }}
  whileHover={{ y: -4 }}
>
  <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-secondary/5 via-background to-background">
    <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-muted-foreground">Active Users</CardTitle>
      <div className="p-2 bg-success/10 rounded-lg">
        <UserCheck className="h-5 w-5 text-success" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent hover:text-primary">
        {userStats.active}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Currently active</p>
    </CardContent>
  </Card>
</motion.div>

<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.3 }}
  whileHover={{ y: -4 }}
>
  <Card className="relative overflow-hidden border-2 hover:border-destructive/50 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-error/5 via-background to-background">
    <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-muted-foreground">Admins</CardTitle>
      <div className="p-2 bg-error/10 rounded-lg">
        <Shield className="h-5 w-5 text-error" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
        {userStats.admins}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Admin accounts</p>
    </CardContent>
  </Card>
</motion.div>

<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.4 }}
  whileHover={{ y: -4 }}
>
  <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-info/5 via-background to-background">
    <div className="absolute top-0 right-0 w-32 h-32 bg-info/10 rounded-full blur-3xl" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-muted-foreground">Staff Members</CardTitle>
      <div className="p-2 bg-info/10 rounded-lg">
        <UserX className="h-5 w-5 text-info" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">
        {userStats.staff}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Staff accounts</p>
    </CardContent>
  </Card>
</motion.div>
</div>

{/* Users Table */}
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.5 }}
>
<Card className="border-2 shadow-xl overflow-hidden backdrop-blur-sm bg-background/95">
  <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
    <CardTitle className="text-2xl">Users Directory</CardTitle>
    <CardDescription className="text-base">Manage user accounts, roles, and permissions</CardDescription>
  </CardHeader>
  <CardContent className="p-6">
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border-2 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-muted/50 p-1">
      <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        All Users
      </TabsTrigger>
      <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Admins
      </TabsTrigger>
      <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Staff
      </TabsTrigger>
      <TabsTrigger value="tourist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Users
      </TabsTrigger>
      <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
        Active
      </TabsTrigger>
      <TabsTrigger value="suspended" className="data-[state=active]:bg-destructive data-[state=active]:text-primary-foreground">
        Suspended
      </TabsTrigger>
    </TabsList>

<TabsContent value={activeTab} className="space-y-4 mt-6">
  <div className="rounded-xl border-2 overflow-hidden bg-card">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
          <TableHead className="font-bold text-foreground">User</TableHead>
          <TableHead className="font-bold text-foreground">Role</TableHead>
          <TableHead className="font-bold text-foreground">Status</TableHead>
          <TableHead className="font-bold text-foreground">Last Login</TableHead>
          <TableHead className="font-bold text-foreground">Bookings</TableHead>
          <TableHead className="font-bold text-foreground">Join Date</TableHead>
          <TableHead className="w-[50px] font-bold text-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user, index) => (
          <motion.tr
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b hover:bg-muted/50 transition-colors group"
          >
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg text-accent-foreground">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {user.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getRoleColor(user.role)} className="font-semibold px-3 py-1">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(user.status)} className="font-semibold px-3 py-1">
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
          {user.last_login_at ? dayjs(user.last_login_at).fromNow() : 'Never logged in'}
            </TableCell>
            <TableCell>
              <span className="font-semibold text-primary text-center">{user.bookings_count ?? 0}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.created_at).toLocaleString('en-PH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border-2 text-accent-foreground">
                  <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Edit User</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">Change Role</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleResetPassword(user.id)}>Reset Password</DropdownMenuItem>
                  <DropdownMenuSeparator />
                 {user.status === "active" ? (
                    <DropdownMenuItem
                      className="cursor-pointer text-warning font-semibold"
                      onClick={() => handleToggleStatus(user.id, 'suspended')}
                    >
                      Suspend User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="cursor-pointer text-success font-semibold"
                      onClick={() => handleToggleStatus(user.id, 'active')}
                    >
                      Activate User
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem className="cursor-pointer text-destructive font-semibold" onClick={() => handleUserDelete(user.id)}>

                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  </div>
</TabsContent>
    </Tabs>
  </div>
</CardContent>
</Card>
</motion.div>
</div>
</AppLayout>
);
}
