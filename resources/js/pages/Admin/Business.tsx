import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Businesses Management',
        href: route('admin.business'), 
    },
];

export default function Business() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

   const businesses = [
    {
      id: 1,
      name: "Donsol Beach Resort",
      type: "Hotel",
      owner: "Maria Santos",
      email: "maria@donsolbeach.com",
      phone: "+63 912 345 6789",
      address: "Barangay Dancalan, Donsol, Sorsogon",
      rating: 4.5,
      reviews: 124,
      status: "Approved",
      registrationDate: "2024-01-15",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Whale Shark Restaurant",
      type: "Restaurant",
      owner: "Juan Dela Cruz",
      email: "juan@whaleshark.ph",
      phone: "+63 923 456 7890",
      address: "Poblacion, Donsol, Sorsogon",
      rating: 4.2,
      reviews: 89,
      status: "Pending",
      registrationDate: "2024-02-01",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Local Guide Services",
      type: "Tour Guide",
      owner: "Pedro Reyes",
      email: "pedro@localguide.ph",
      phone: "+63 934 567 8901",
      address: "Barangay Dancalan, Donsol, Sorsogon",
      rating: 4.8,
      reviews: 156,
      status: "Approved",
      registrationDate: "2024-01-20",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      name: "Sorsogon Transport Co.",
      type: "Transport",
      owner: "Ana Garcia",
      email: "ana@sorsogontransport.com",
      phone: "+63 945 678 9012",
      address: "National Highway, Donsol, Sorsogon",
      rating: 4.0,
      reviews: 67,
      status: "Rejected",
      registrationDate: "2024-02-10",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Pending": return "secondary";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="w-4 h-4" />;
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && business.status.toLowerCase() === activeTab;
  });


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
           <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Businesses</h1>
          <p className="text-muted-foreground">Approve and manage business registrations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-ocean">
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Business</DialogTitle>
              <DialogDescription>Register a new business partner</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="guide">Tour Guide</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" placeholder="Enter owner name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter business address" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-ocean">Add Business</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+8 from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">98</div>
              <p className="text-xs text-muted-foreground">79% of total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">18</div>
              <p className="text-xs text-muted-foreground">Requires approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.4</div>
              <p className="text-xs text-muted-foreground">+0.1 from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registered Businesses</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
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
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={business.image}
                            alt={business.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{business.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {business.address.split(',')[0]}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{business.owner}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {business.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {business.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{business.rating}</span>
                          <span className="text-sm text-muted-foreground">({business.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(business.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(business.status)}
                          {business.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{business.registrationDate}</TableCell>
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
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Reject
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
