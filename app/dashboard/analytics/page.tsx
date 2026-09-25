'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  FolderOpen,
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIUsageData {
  date: string;
  tokens: number;
  requests: number;
}

interface ProjectStats {
  total: number;
  thisWeek: number;
  growth: number;
}

export default function AnalyticsPage() {
  const [aiUsageData, setAiUsageData] = useState<AIUsageData[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 0,
    thisWeek: 0,
    growth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [webVitals, setWebVitals] = useState({
    LCP: null as number | null,
    INP: null as number | null,
    CLS: null as number | null,
  });

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAiUsageData(data.aiUsage);
      setProjectStats(data.projects);
    } catch (error) {
      // Silently fail - analytics will show empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Collect Web Vitals
  useEffect(() => {
    const collectVitals = async () => {
      // Dynamic import to avoid SSR issues
      const webVitalsModule = await import('web-vitals');

      webVitalsModule.onLCP((metric: { value: number }) => {
        setWebVitals(
          (prev: {
            LCP: number | null;
            INP: number | null;
            CLS: number | null;
          }) => ({ ...prev, LCP: metric.value })
        );
      });

      webVitalsModule.onINP((metric: { value: number }) => {
        setWebVitals(
          (prev: {
            LCP: number | null;
            INP: number | null;
            CLS: number | null;
          }) => ({ ...prev, INP: metric.value })
        );
      });

      webVitalsModule.onCLS((metric: { value: number }) => {
        setWebVitals(
          (prev: {
            LCP: number | null;
            INP: number | null;
            CLS: number | null;
          }) => ({ ...prev, CLS: metric.value })
        );
      });
    };

    collectVitals();
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Memoize expensive chart data transformation
  const chartData = useMemo(() => {
    return aiUsageData.map((item) => ({
      ...item,
      tokensFormatted: item.tokens.toLocaleString(),
    }));
  }, [aiUsageData]);

  const getVitalsRating = (
    value: number | null,
    type: 'LCP' | 'INP' | 'CLS'
  ): 'good' | 'needs-improvement' | 'poor' => {
    if (value === null) return 'needs-improvement';

    if (type === 'LCP') {
      return value < 2500
        ? 'good'
        : value < 4000
          ? 'needs-improvement'
          : 'poor';
    } else if (type === 'INP') {
      return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
    } else {
      // CLS
      return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    }
  };

  const getVitalsColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track your AI usage and performance metrics
          </p>
        </div>
        <Button onClick={fetchAnalytics} disabled={isLoading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Web Vitals Widget */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LCP</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getVitalsColor(getVitalsRating(webVitals.LCP, 'LCP'))}`}
            >
              {webVitals.LCP
                ? `${(webVitals.LCP / 1000).toFixed(2)}s`
                : 'Collecting...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Largest Contentful Paint
            </p>
            <p className="text-xs mt-1">
              Status:{' '}
              <span
                className={getVitalsColor(
                  getVitalsRating(webVitals.LCP, 'LCP')
                )}
              >
                {getVitalsRating(webVitals.LCP, 'LCP').replace('-', ' ')}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">INP</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getVitalsColor(getVitalsRating(webVitals.INP, 'INP'))}`}
            >
              {webVitals.INP ? `${webVitals.INP}ms` : 'Collecting...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Interaction to Next Paint
            </p>
            <p className="text-xs mt-1">
              Status:{' '}
              <span
                className={getVitalsColor(
                  getVitalsRating(webVitals.INP, 'INP')
                )}
              >
                {getVitalsRating(webVitals.INP, 'INP').replace('-', ' ')}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLS</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getVitalsColor(getVitalsRating(webVitals.CLS, 'CLS'))}`}
            >
              {webVitals.CLS ? webVitals.CLS.toFixed(3) : 'Collecting...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cumulative Layout Shift
            </p>
            <p className="text-xs mt-1">
              Status:{' '}
              <span
                className={getVitalsColor(
                  getVitalsRating(webVitals.CLS, 'CLS')
                )}
              >
                {getVitalsRating(webVitals.CLS, 'CLS').replace('-', ' ')}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{projectStats.thisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.growth}%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Current session</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>AI Token Usage Over Time</CardTitle>
          <CardDescription>
            Daily token consumption and request count
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading chart...</p>
            </div>
          ) : aiUsageData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  No AI usage data yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start using the AI Playground to see your usage analytics
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tokens"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Tokens"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="requests"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* AI Usage Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution</CardTitle>
          <CardDescription>Token usage by date</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tokens" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>
            Download your usage data for further analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
