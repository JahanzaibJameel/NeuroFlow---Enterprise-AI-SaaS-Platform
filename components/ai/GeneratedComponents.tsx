'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { FolderOpen, Bell, TrendingUp, Users } from 'lucide-react';

interface TopProjectsProps {
  projects: Array<{
    id: string;
    name: string;
    description?: string | null;
    updatedAt: Date;
  }>;
}

export function TopProjects({ projects }: TopProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          Top Projects
        </CardTitle>
        <CardDescription>Your most recently updated projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <h4 className="font-medium mb-1">{project.name}</h4>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description}
                  </p>
                )}
                <Badge variant="secondary" className="text-xs">
                  Updated {formatDate(project.updatedAt)}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface RecentActivityProps {
  activities: Array<{
    id: string;
    title: string;
    content?: string | null;
    timestamp: Date;
    read: boolean;
  }>;
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest notifications and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border ${
                  !activity.read ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    {activity.content && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.content}
                      </p>
                    )}
                  </div>
                  {!activity.read && (
                    <Badge className="text-xs">New</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {formatDate(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    tokens: number;
  }>;
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.tokens), 1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          AI Usage Analytics
        </CardTitle>
        <CardDescription>Tokens used over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end gap-2">
          {data.length === 0 ? (
            <p className="text-muted-foreground text-sm w-full text-center py-8">
              No AI usage data yet
            </p>
          ) : (
            data.map((item) => (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary/80 hover:bg-primary transition-colors rounded-t"
                  style={{
                    height: `${(item.tokens / maxValue) * 250}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground rotate-0 whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface UserStatsProps {
  stats: {
    projects: number;
    files: number;
    unreadNotifications: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projects}</div>
          <p className="text-xs text-muted-foreground">Total projects</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Files</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.files}</div>
          <p className="text-xs text-muted-foreground">Stored in cloud</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
          <p className="text-xs text-muted-foreground">Unread messages</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface TeamMembersProps {
  members: Array<{
    id: string;
    name: string | null;
    role: string;
    avatar: string | null;
  }>;
}

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team Members
        </CardTitle>
        <CardDescription>Your project collaborators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name || 'User'}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {(member.name || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {member.name || 'Anonymous'}
                </h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
