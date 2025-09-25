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
  MapPin,
  Star,
  Users,
  Calendar
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
import { motion } from "framer-motion"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Destinations Management',
        href: route('admin.destinations'), 
    },
];

export default function ManageDestinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const destinations = [
    {
      id: 1,
      name: "Whale Shark Interaction",
      category: "Marine Adventure",
      location: "Donsol Bay",
      price: "₱1,500",
      rating: 4.9,
      bookings: 247,
      status: "Active",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Firefly Watching",
      category: "Nature Experience",
      location: "Donsol River",
      price: "₱800",
      rating: 4.7,
      bookings: 156,
      status: "Active",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop",
      createdAt: "2024-01-20"
    },
    {
      id: 3,
      name: "Island Hopping",
      category: "Adventure",
      location: "Sorsogon Islands",
      price: "₱2,200",
      rating: 4.8,
      bookings: 89,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop",
      createdAt: "2024-02-01"
    }
  ];

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
           <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Destinations</h1>
          <p className="text-muted-foreground">Create and manage tour packages and attractions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-ocean">
              <Plus className="w-4 h-4 mr-2" />
              Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Destination</DialogTitle>
              <DialogDescription>Create a new tour package or attraction</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input id="name" placeholder="Enter destination name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marine">Marine Adventure</SelectItem>
                    <SelectItem value="nature">Nature Experience</SelectItem>
                    <SelectItem value="cultural">Cultural Tour</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" placeholder="₱0.00" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter destination description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-ocean">Create Destination</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">75% of total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
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
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Destinations</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search destinations..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDestinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{destination.name}</div>
                        <div className="text-sm text-muted-foreground">Created {destination.createdAt}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{destination.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {destination.location}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{destination.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {destination.rating}
                    </div>
                  </TableCell>
                  <TableCell>{destination.bookings}</TableCell>
                  <TableCell>
                    <Badge variant={destination.status === "Active" ? "default" : "secondary"}>
                      {destination.status}
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
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
        </AppLayout>
    );
}
