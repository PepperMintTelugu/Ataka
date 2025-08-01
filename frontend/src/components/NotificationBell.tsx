import React, { useState } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  ShoppingCart,
  Heart,
  Package,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotificationHelpers,
  Notification,
} from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  const iconClass = "w-4 h-4";

  switch (type) {
    case "cart_abandoned":
      return <ShoppingCart className={cn(iconClass, "text-orange-500")} />;
    case "wishlist_reminder":
      return <Heart className={cn(iconClass, "text-red-500")} />;
    case "stock_alert":
      return <Package className={cn(iconClass, "text-green-500")} />;
    case "order_update":
      return <Package className={cn(iconClass, "text-blue-500")} />;
    case "promotion":
      return <Tag className={cn(iconClass, "text-purple-500")} />;
    default:
      return <AlertCircle className={cn(iconClass, "text-gray-500")} />;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationHelpers();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle notification-specific actions
    if (notification.type === "cart_abandoned") {
      // Navigate to cart or show cart sidebar
      window.dispatchEvent(new CustomEvent("openCart"));
    } else if (
      notification.type === "wishlist_reminder" &&
      notification.data?.bookId
    ) {
      // Navigate to book page
      window.location.href = `/book/${notification.data.bookId}`;
    } else if (
      notification.type === "order_update" &&
      notification.data?.orderNumber
    ) {
      // Navigate to order tracking
      window.location.href = `/track-order/${notification.data.orderNumber}`;
    }

    setIsOpen(false);
  };

  const recentNotifications = notifications.slice(0, 10); // Show last 10 notifications

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-auto p-1 text-xs"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {recentNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="p-2">
              {recentNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                      notification.read
                        ? "hover:bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <NotificationIcon type={notification.type} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              !notification.read && "font-semibold",
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < recentNotifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 10 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                // Navigate to full notifications page
                window.location.href = "/notifications";
                setIsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
