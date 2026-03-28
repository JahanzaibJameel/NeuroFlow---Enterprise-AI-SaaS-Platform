'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, Sparkles, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Projects',
    value: '3',
    description: '+2 this month',
    icon: FolderOpen,
  },
  {
    title: 'AI Generations',
    value: '47',
    description: '+12% from last week',
    icon: Sparkles,
  },
  {
    title: 'Team Members',
    value: '5',
    description: 'All active',
    icon: Users,
  },
  {
    title: 'Performance Score',
    value: '98',
    description: 'Excellent',
    icon: TrendingUp,
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest projects and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProjectItem
                name="AI Marketing Dashboard"
                description="Generative UI dashboard for marketing analytics"
                status="Active"
              />
              <ProjectItem
                name="E-commerce Platform"
                description="Full-stack e-commerce with AI recommendations"
                status="In Progress"
              />
              <ProjectItem
                name="Mobile App Landing Page"
                description="Marketing site with 3D elements"
                status="Completed"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Stay updated with your account activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NotificationItem
                title="Welcome to NeuroFlow!"
                description="Get started by exploring the AI Playground."
                time="Just now"
              />
              <NotificationItem
                title="New Feature Available"
                description="Generative UI is now in beta. Try it out!"
                time="2 hours ago"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <QuickActionCard
            title="Create New Project"
            description="Start a new project from scratch"
            href="/dashboard/projects/new"
          />
          <QuickActionCard
            title="Try AI Playground"
            description="Generate UI components with AI"
            href="/dashboard/ai-playground"
          />
          <QuickActionCard
            title="View Analytics"
            description="Check your performance metrics"
            href="/dashboard/analytics"
          />
        </div>
      </div>
    </div>
  );
}

function ProjectItem({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
        {status}
      </span>
    </div>
  );
}

function NotificationItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="p-3 rounded-lg border bg-card">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <span className="text-xs text-muted-foreground mt-2 block">{time}</span>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}
