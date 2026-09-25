import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

// GET all projects for current user
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    let projects: Array<{
      id: string;
      name: string;
      description: string | null;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    try {
      projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable, returning empty projects list', {
          module: 'projects-api',
          action: 'GET',
        });
      } else {
        throw dbError;
      }
    }

    return NextResponse.json({ projects });
  } catch (error) {
    logger.error('Error fetching projects', error, {
      module: 'projects-api',
      action: 'GET',
    });
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ project }, { status: 201 });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during project creation', {
          module: 'projects-api',
          action: 'POST',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    logger.error('Error creating project', error, {
      module: 'projects-api',
      action: 'POST',
    });
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      );
    }

    try {
      const project = await prisma.project.update({
        where: { id },
        data: { name, description },
      });

      return NextResponse.json({ project });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during project update', {
          module: 'projects-api',
          action: 'PUT',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    logger.error('Error updating project', error, {
      module: 'projects-api',
      action: 'PUT',
    });
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Remove project
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    try {
      await prisma.project.delete({
        where: { id },
      });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during project deletion', {
          module: 'projects-api',
          action: 'DELETE',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting project', error, {
      module: 'projects-api',
      action: 'DELETE',
    });
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
