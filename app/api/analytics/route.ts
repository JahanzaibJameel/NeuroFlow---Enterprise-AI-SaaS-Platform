import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch AI usage data grouped by date
    let aiUsage: Array<{ date: string; tokens: number; requests: number }> = [];
    let totalProjects = 0;
    let projectsThisWeek = 0;
    let growth = 100;

    try {
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
      aiUsage = (aiUsageRaw as AIUsageGroup[]).map((item) => ({
        date: item.createdAt.toISOString().split('T')[0],
        tokens: item._sum.tokens || 0,
        requests: item._count.id,
      }));

      // Fetch project stats
      totalProjects = await prisma.project.count({
        where: { userId },
      });

      projectsThisWeek = await prisma.project.count({
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

      growth =
        lastMonthProjects > 0
          ? Math.round(
              ((projectsThisWeek - lastMonthProjects) / lastMonthProjects) * 100
            )
          : 100;
    } catch (dbError) {
      // Handle database connection errors gracefully (e.g., during Vercel build)
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable, returning empty analytics', {
          module: 'analytics-api',
        });
        // Return empty data for build-time rendering
      } else {
        throw dbError;
      }
    }

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
