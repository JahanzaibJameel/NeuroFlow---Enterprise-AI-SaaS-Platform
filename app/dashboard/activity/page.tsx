'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity as ActivityIcon, Clock, Calendar, TrendingUp } from 'lucide-react';

const activities = [
  {
    id: 1,
    action: 'Logged in',
    description: 'Successful login from Chrome on Windows',
    time: '2 minutes ago',
    type: 'auth',
  },
  {
    id: 2,
    action: 'Created project',
    description: 'AI Marketing Dashboard',
    time: '1 hour ago',
    type: 'project',
  },
  {
    id: 3,
    action: 'Used AI Playground',
    description: 'Generated TopProjects component',
    time: '3 hours ago',
    type: 'ai',
  },
  {
    id: 4,
    action: 'Viewed analytics',
    description: 'Checked performance metrics',
    time: '5 hours ago',
    type: 'analytics',
  },
  {
    id: 5,
    action: 'Updated settings',
    description: 'Changed theme preference',
    time: '1 day ago',
    type: 'settings',
  },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity</h1>
          <p className="text-muted-foreground">Recent activity across your account</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">All tracked actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/7</div>
            <p className="text-xs text-muted-foreground">Days this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`mt-1 p-2 rounded-full ${
                  activity.type === 'auth' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'project' ? 'bg-green-100 text-green-600' :
                  activity.type === 'ai' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'analytics' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <ActivityIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{activity.action}</h4>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Activity Log</CardTitle>
          <CardDescription>Download your activity history for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Export your complete activity log in CSV or JSON format.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">Export as CSV</Button>
            <Button variant="outline">Export as JSON</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
