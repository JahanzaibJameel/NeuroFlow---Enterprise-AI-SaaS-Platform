import { prisma } from '@/lib/db';

/**
 * AI-Generated Component Registry
 * Maps AI responses to actual React components with real data
 */

// Component type definitions
export interface GeneratedComponent {
  type: string;
  props: Record<string, any>;
}

/**
 * Hardcoded component mappings for Phase 1
 * These will be replaced/supplemented by dynamic generation in Phase 3
 */
export const componentRegistry = {
  TopProjects: async (userId: string) => {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return {
      type: 'TopProjects',
      props: {
        projects: projects.map(
          (p: {
            id: string;
            name: string;
            description: string | null;
            updatedAt: Date;
          }) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            updatedAt: p.updatedAt,
          })
        ),
      },
    };
  },

  RecentActivity: async (userId: string) => {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      type: 'RecentActivity',
      props: {
        activities: notifications.map(
          (n: {
            id: string;
            title: string;
            content: string | null;
            createdAt: Date;
            read: boolean;
          }) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            timestamp: n.createdAt,
            read: n.read,
          })
        ),
      },
    };
  },

  AnalyticsChart: async (userId: string) => {
    const aiUsage = await prisma.aIUsage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date for chart
    const data = aiUsage.reduce(
      (
        acc: Record<string, number>,
        usage: { createdAt: Date; tokens: number | null }
      ) => {
        const date = usage.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + (usage.tokens || 0);
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      type: 'AnalyticsChart',
      props: {
        data: Object.entries(data).map(([date, tokens]) => ({
          date,
          tokens,
        })),
      },
    };
  },

  UserStats: async (userId: string) => {
    const [projectCount, fileCount, notificationCount] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.file.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return {
      type: 'UserStats',
      props: {
        stats: {
          projects: projectCount,
          files: fileCount,
          unreadNotifications: notificationCount,
        },
      },
    };
  },

  TeamMembers: async (userId: string) => {
    // For now, just return the user themselves
    // In a real app, you'd have a separate Team model
    return {
      type: 'TeamMembers',
      props: {
        members: [
          {
            id: userId,
            name: 'Current User',
            role: 'Owner',
            avatar: null,
          },
        ],
      },
    };
  },
};

/**
 * Prompt to component mapping
 * Uses keyword matching to determine which component to generate
 */
export const promptToComponent: Record<string, keyof typeof componentRegistry> =
  {
    'top projects': 'TopProjects',
    'recent projects': 'TopProjects',
    'my projects': 'TopProjects',
    activity: 'RecentActivity',
    notifications: 'RecentActivity',
    'recent activity': 'RecentActivity',
    analytics: 'AnalyticsChart',
    chart: 'AnalyticsChart',
    graph: 'AnalyticsChart',
    stats: 'UserStats',
    statistics: 'UserStats',
    metrics: 'UserStats',
    team: 'TeamMembers',
    members: 'TeamMembers',
  };

/**
 * Match user prompt to a component
 */
export function matchPromptToComponent(prompt: string): string | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const [keywords, componentName] of Object.entries(promptToComponent)) {
    if (lowerPrompt.includes(keywords)) {
      return componentName;
    }
  }

  return null;
}

/**
 * Generate component based on prompt with real data
 */
export async function generateComponentFromPrompt(
  prompt: string,
  userId: string
): Promise<GeneratedComponent | null> {
  const componentName = matchPromptToComponent(prompt);

  if (!componentName) {
    return null;
  }

  const componentFn =
    componentRegistry[componentName as keyof typeof componentRegistry];

  if (!componentFn) {
    return null;
  }

  return await componentFn(userId);
}
