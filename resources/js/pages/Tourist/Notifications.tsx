import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Filter, Calendar, CreditCard, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { usePage, router, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from "sonner";
import Swal from "sweetalert2";

interface TouristNotification {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: string; 
  read: boolean;
}

type NotificationType = TouristNotification['type'];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: '',
    href: '/tourist/notifications',
  },
];

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "booking": return <Calendar className="w-5 h-5" />;
    case "payment": return <CreditCard className="w-5 h-5" />;
    case "reminder": return <Bell className="w-5 h-5" />;
    case "update": return <Info className="w-5 h-5" />;
    case "alert": return <AlertCircle className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

const NotificationBadge = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "booking": return <Badge variant="secondary">Booking</Badge>;
    case "payment": return <Badge variant="outline">Payment</Badge>;
    case "reminder": return <Badge variant="default">Reminder</Badge>;
    case "update": return <Badge variant="outline">Update</Badge>;
    case "alert": return <Badge variant="destructive">Alert</Badge>;
    default: return <Badge variant="outline">Info</Badge>;
  }
};

export default function Notifications() {

  const { notifications: initialNotifications = [] } = usePage().props as {
    notifications?: TouristNotification[];
  };

  const [notifications, setNotifications] = useState<TouristNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((notif) =>
    filter === "all" ? true : !notif.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id: string) => {
  const prevNotifications = notifications;
  setNotifications(notifs =>
    notifs.map(n => (n.id === id ? { ...n, read: true } : n))
  );

  router.post(
    route('tourist.notifications.markRead', { notification: id }),
    {},
    {
      preserveScroll: true,
      onError: () => {
        // Revert on error
        setNotifications(prevNotifications);
        toast.error("Failed to mark as read");
      }
    }
  );
};
  const markAllAsRead = () => {
    setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
    router.post(
      route('tourist.notifications.markAllRead'),
      {},
      { preserveScroll: true }
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifs => notifs.filter(n => n.id !== id));
    Swal.fire({
      title: 'Are you sure?',
      text: "This notification will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(
          route('tourist.notifications.delete', { notification: id }),
          { preserveScroll: true }
        );
        Swal.fire(
          'Deleted!',
          'The notification has been deleted.',
          'success'
        );
      }
    })
  };


  return (
    <>
      <Head title="Donsol Tourism Management System" />
 
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-full">
          {/* Header */}
          <div className="mb-8 animate-fade-in w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with your bookings and activities
            </p>
          </div>

          {/* Stats & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-4">
              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-2 mx-10">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="hover:scale-105 transition-transform"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("unread")}>Unread Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="border-2 animate-fade-in">
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === "unread" ? "You're all caught up!" : "You don't have any notifications yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <Card
                  key={notification.id}
                  className={`border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in ${
                    !notification.read ? "bg-primary/5 border-primary/20" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          !notification.read ? "bg-primary/20" : "bg-muted"
                        } transition-colors`}
                      >
                        <NotificationIcon type={notification.type} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            )}
                          </div>
                          <NotificationBadge type={notification.type} />
                        </div>

                        <p className="text-muted-foreground mb-3">{notification.message}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="hover:scale-105 transition-transform"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="hover:text-destructive hover:scale-105 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
   </>
  );
}