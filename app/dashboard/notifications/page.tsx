'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Mail, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    title: 'Welcome to NeuroFlow!',
    content:
      'Get started by exploring the AI Playground and creating your first project.',
    type: 'info',
    read: false,
    time: 'Just now',
  },
  {
    id: 2,
    title: 'New Feature Available',
    content: 'Generative UI is now in beta. Try it out in the AI Playground!',
    type: 'success',
    read: false,
    time: '2 hours ago',
  },
  {
    id: 3,
    title: 'System Update',
    content: "We've improved performance and fixed several bugs.",
    type: 'info',
    read: true,
    time: '1 day ago',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Stay updated with your account activity</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">You&apos;re all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? 'bg-accent/50 border-primary/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 ${
                      notification.type === 'success'
                        ? 'text-green-600'
                        : notification.type === 'error'
                          ? 'text-red-600'
                          : 'text-blue-600'
                    }`}
                  >
                    {notification.type === 'success' ? (
                      <Check className="h-5 w-5" />
                    ) : notification.type === 'error' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {notification.time}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email and push notification settings coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
