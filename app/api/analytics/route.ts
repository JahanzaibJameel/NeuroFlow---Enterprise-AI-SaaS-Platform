import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch AI usage data grouped by date
    const aiUsageRaw = await prisma.aIUsage.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      _sum: {
        tokens: true,
      },
      _count: {
        id: true,
      },
    });

    // Transform data for chart
    interface AIUsageGroup {
      createdAt: Date;
      _sum: { tokens: number | null };
      _count: { id: number };
    }
    const aiUsage = (aiUsageRaw as AIUsageGroup[]).map((item) => ({
      date: item.createdAt.toISOString().split('T')[0],
      tokens: item._sum.tokens || 0,
      requests: item._count.id,
    }));

    // Fetch project stats
    const totalProjects = await prisma.project.count({
      where: { userId },
    });

    const projectsThisWeek = await prisma.project.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const lastMonthProjects = await prisma.project.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const growth =
      lastMonthProjects > 0
        ? Math.round(
            ((projectsThisWeek - lastMonthProjects) / lastMonthProjects) * 100
          )
        : 100;

    return NextResponse.json({
      aiUsage,
      projects: {
        total: totalProjects,
        thisWeek: projectsThisWeek,
        growth,
      },
    });
  } catch (error) {
    logger.error('Analytics fetch failed', error, { module: 'analytics-api' });
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
