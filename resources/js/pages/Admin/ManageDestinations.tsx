  import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
  import AppLayout from '@/layouts/app-layout';
  import { type BreadcrumbItem } from '@/types';
  import { Head, useForm, usePage} from '@inertiajs/react';
  import { route } from 'ziggy-js';
  import React, { FormEvent, useState, useEffect } from "react";
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
    Calendar,
    CheckCircle2Icon,
    Megaphone
  } from "lucide-react";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
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
import { bookings } from '@/routes/admin';
  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Destinations Management',
          href: route('admin.destinations'), 
      },
  ];
    interface Destinations{
    id: number;
    name: string;
    category: string;
    location: string;
    price: number;
    rating: number;
    bookings_count: number;
    description: string;
    status: string;
    image: string;        
    created_at: string;
    updated_at: string;
    }
    interface Stats {
    total_destinations: number;
    active_tours: number;
    total_bookings: number;
    avg_rating: number;
  }

  interface PageProps{
    flash: {
      message?: string
    },
    destinations: 
      Destinations[];
    
  stats?: Stats;

  }
  export default function ManageDestinations() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<Destinations | null>(null);
    const { data, put, setData, post, processing, errors, delete: destroy, reset: resetInertiaForm } = useForm({
      name: '',
      category: '',
      location:  '',
      price:  '',
      rating: '',
      bookings: '',
      description:  '',
      status:  '',
      image: null as File | null,
    });

  useEffect(() => {
    if (selectedDestination) {
      setData({
        name: selectedDestination.name,
        category: selectedDestination.category,
        location: selectedDestination.location,
        price: selectedDestination.price.toString(),
        rating: selectedDestination.rating,
        description: selectedDestination.description,
        status: selectedDestination.status,
        image: null,
      });
    }
  }, [selectedDestination, setData]);

  const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
      };

  const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return num.toString();
    };

    const formatRating = (rating: number): string => {
      return rating.toFixed(1);
    };

  const { destinations = [], flash, stats = {
      total_destinations: 0,
      active_tours: 0,
      total_bookings: 0,
      avg_rating: 0
    } } = usePage().props as PageProps;

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || dest.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || dest.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

    const handleSumbit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('admin.destinations.store'), {
        preserveScroll: true,
        onSuccess: () => {
          setIsAddDialogOpen(false);
          resetInertiaForm();
        },
        onError: (errors) => {
          console.error('Submission failed:', errors);
        }
      });
    };

    const handleEditDestination = (destination: any) => { 
    setSelectedDestination(destination);
    setIsEditDialogOpen(true);
  };

const handleUpdate = (e: React.FormEvent) => {
  e.preventDefault();
if (!selectedDestination) return;

  if (!selectedDestination) return;
  // Prepare FormData
  const formData = new FormData();
  if (data.name !== undefined && data.name !== null) formData.append('name', String(data.name));
  if (data.category !== undefined && data.category !== null) formData.append('category', String(data.category));
  if (data.location !== undefined && data.location !== null) formData.append('location', String(data.location));
  if (data.price !== undefined && data.price !== null) formData.append('price', String(data.price));
  if (data.rating !== undefined && data.rating !== null) formData.append('rating', String(data.rating));
  if (data.status !== undefined && data.status !== null) formData.append('status', String(data.status));
  if (data.description !== undefined && data.description !== null) formData.append('description', String(data.description));
   if (data.image instanceof File) {
    formData.append('image', data.image); 
  } else if (data.image === null || data.image === '') {
    formData.append('image', ''); 
  }

  post(route('admin.destinations.update', selectedDestination.id), {
    data: formData,
    forceFormData: true,
    headers: { 'X-HTTP-Method-Override': 'PUT' },
    preserveScroll: true,
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      resetInertiaForm();
    },
    onError: (errors) => {
      console.error('Submission failed:', errors);
    }
  });
};
    const handleDelete = (id: number, name: string) => {
    if(confirm(`Do you want to delete this destination - ${id}, ${name}`)){
        destroy(route("admin.destinations.destroy", id));
    }

    }
return (
      <AppLayout breadcrumbs={breadcrumbs}>
  <div className="p-6 space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <div>
          {flash.message &&(
            <Alert>
            <Megaphone />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              {flash.message}
            </AlertDescription>
          </Alert>
          )}
        </div>
        <h1 className="text-3xl font-bold">Manage Destinations</h1>
        <p className="text-muted-foreground">Create and manage tour packages and attractions</p>
      </div>
    <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetInertiaForm();
          }
          setIsAddDialogOpen(open);
          if (open) setIsEditDialogOpen(false); 
        }}
      >
        <DialogTrigger asChild>
          <Button className="btn-ocean">
            <Plus className="w-4 h-4 mr-2"/>
              Add Destination
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSumbit} encType="multipart/form-data">
            {/* Errors Checks */}
            {Object.keys(errors).length > 0 && (<Alert>
              <CheckCircle2Icon />
              <AlertTitle>Errors! Check Inputs</AlertTitle>
              <AlertDescription>
                <ul>
                  {Object.entries(errors).map(([key, message]) => (<li key={key}>{message as string}</li>) )}
                </ul>
              </AlertDescription>
            </Alert>
              )}
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
            <DialogDescription>Create a new tour package or attraction</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Destination Name</Label>
              <Input id="name" placeholder="Enter destination name" value={data.name} onChange={(e) => setData('name', e.target.value)} required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={data.category} 
                  onValueChange={(value) => setData('category', value)} required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>      
                  <SelectContent className="text-black">
                    <SelectItem value="marine">Marine Adventure</SelectItem>
                    <SelectItem value="nature">Nature Experience</SelectItem>
                    <SelectItem value="cultural">Cultural Tour</SelectItem>
                    <SelectItem value="whaleshark">Whale Shark</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
          </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter location" value={data.location} onChange={(e) => setData('location', e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" placeholder="₱0.00" value={data.price} onChange={(e) => setData('price', e.target.value)} required/>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter destination description" value={data.description} onChange={(e) => setData('description', e.target.value)}/>
            </div>
        <div className="col-span-2 space-y-2">
        <Label htmlFor="description">Destination image</Label>
            <Input
              type="file"
              accept="image/*"
              id="destination-img"
              onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
            />
          </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetInertiaForm();}}>
              Cancel
            </Button>
            <Button className="btn-ocean" disabled={processing} type='submit'>Create Destination</Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

  {/* Edit Destination Dialog */} 
    <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetInertiaForm();
            setSelectedDestination(null);
          }
          setIsEditDialogOpen(open);
          if (open) setIsAddDialogOpen(false); 
        }}
      >
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleUpdate} encType="multipart/form-data"> 
          
          {/* Errors Checks */}
           {Object.keys(errors).length > 0 && (<Alert>
              <CheckCircle2Icon />
              <AlertTitle>Errors! Check Inputs</AlertTitle>
              <AlertDescription>
                <ul>
                  {Object.entries(errors).map(([key, message]) => (<li key={key}>{message as string}</li>) )}
                </ul>
              </AlertDescription>
            </Alert>
              )}
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>Update destination information and settings</DialogDescription>
          </DialogHeader>

  {selectedDestination && (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Destination Name</Label>
        <Input
          id="edit-name" 
          placeholder="Enter destination name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-category">Category</Label>
        <Select
          value={data.category}
          onValueChange={(value) => setData('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="text-black">
            <SelectItem value="marine">Marine Adventure</SelectItem>
            <SelectItem value="nature">Nature Experience</SelectItem>
            <SelectItem value="cultural">Cultural Tour</SelectItem>
            <SelectItem value="whaleshark">Whale Shark</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select
          value={data.status}
          onValueChange={(value) => setData('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent className="text-black">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-location">Location</Label>
        <Input
          id="edit-location"
          placeholder="Enter location"
          value={data.location}
          onChange={(e) => setData('location', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-price">Price</Label>
        <Input
          id="edit-price"
          placeholder="₱0.00"
          value={data.price}
          onChange={(e) => setData('price', e.target.value)}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          placeholder="Enter destination description"
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label htmlFor="edit-image">Destination image</Label>
        <Input
          type="file"
          accept="image/*"
          id="edit-destination-img"
          onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
        />
        <div className="mt-2">
          <Label>Current Image:</Label>
          <img
            src={`/storage/${selectedDestination.image}`}
            alt={selectedDestination.name}
            className="w-20 h-20 rounded-lg object-cover mt-1"
          />
        </div>
      </div>
    </div>
  )}

  <div className="flex justify-end gap-2 mt-4">
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        setIsEditDialogOpen(false);
        resetInertiaForm();
      }}
    >
      Cancel
    </Button>
    <Button className="btn-ocean" disabled={processing} type="submit">
      Save Changes
    </Button>
  </div>
</form>
</DialogContent>
</Dialog>


{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
    <Card  className='py-4'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total_destinations}</div>
        <p className="text-xs text-muted-foreground">+2 from last month</p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <Card className='py-4'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.active_tours}</div>
        <p className="text-xs text-muted-foreground">
          {stats.total_destinations > 0 
            ? Math.round((stats.active_tours / stats.total_destinations) * 100) + '% of total'
            : '0% of total'}
        </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
    <Card  className='py-4'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.total_bookings)}</div>
        <p className="text-xs text-muted-foreground">
        {stats.active_tours > 0
        ? `Avg ${Math.round(stats.total_bookings / stats.active_tours)} per tour`
        : 'No active tours'}
             </p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
    <Card  className='py-4'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatRating(stats.avg_rating)}</div>
        <p className="text-xs text-muted-foreground">+0.2 from last month</p>
      </CardContent>
    </Card>
  </motion.div>
</div>

{/* Search and Filters */}
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className='overflow-hidden w-24'>Destinations</CardTitle>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 md:w-80 overflow-hidden"
          />
        </div>
      <div className="w-50">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
             <Filter className="w-4 h-4 mr-1" />
            <SelectValue className='text-black' placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="text-black">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="marine">Marine Adventure</SelectItem>
            <SelectItem value="nature">Nature Experience</SelectItem>
            <SelectItem value="cultural">Cultural Tour</SelectItem>
            <SelectItem value="whaleshark">Whale Shark</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            </SelectContent>
          </Select>   

      <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="text-black">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
              <div className="flex items-center gap-3 min-w-40">
                <img
                  src={`/storage/${destination.image}`}
                  alt={destination.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="font-medium">{destination.name}</div>
                  <div className="text-xs text-muted-foreground max-w-20 absolute w-full">Created  {formatDate(destination.created_at)}</div>
                </div>
              </div>
            </TableCell>
            <TableCell >
              <Badge className='text-white' variant="secondary">{destination.category}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {destination.location}
              </div>
            </TableCell>
            <TableCell className="font-medium">₱{destination.price}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {destination.rating}
              </div>
            </TableCell>
            <TableCell>{destination.bookings_count}</TableCell>
            <TableCell >
              <Badge className='text-white' variant={destination.status === "Active" ? "default" : "secondary"}>
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
                <DropdownMenuContent align="end" className='text-black'>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditDestination(destination)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  <DropdownMenuItem disabled={processing} className="text-destructive hover:bg-red-400 hover:text-black" onClick={() => handleDelete(destination.id, destination.name)}>
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
  };

